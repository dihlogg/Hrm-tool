"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button, Drawer, Input, Select, Spin, Pagination, message } from "antd";
import {
  FileTextOutlined,
  SearchOutlined,
  UserAddOutlined,
  SyncOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useGetJobById } from "@/hooks/ats/jobs/useGetJobById";
import { useGetRankedCandidates } from "@/hooks/ats/applications/useGetRankedCandidates";
import { ApplicationDto } from "@/hooks/ats/applications/ApplicationDto";
import { useGetCvDownloadUrl } from "@/hooks/ats/applications/useGetCvDownloadUrl";
import { API_ENDPOINTS } from "@/services/apiService";
export default function CandidateListPage() {
  const params = useParams();
  const id = params?.id as string;

  const { job, loading: loadingJob, error: jobError } = useGetJobById(id);

  // Pagination & Filters State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [hotReload, setHotReload] = useState(0);
  const [selectedApp, setSelectedApp] = useState<ApplicationDto | null>(null);
  const { openCv } = useGetCvDownloadUrl();
  const [hiringId, setHiringId] = useState<string | null>(null);

  const handleHire = async (app: ApplicationDto) => {
    try {
      setHiringId(app.id);
      const res = await fetch(`${API_ENDPOINTS.HIRE_CANDIDATE}/${app.id}/hire`, {
        method: "POST",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to hire candidate");
      }
      message.success(`Successfully hired ${app.candidate.fullName}! Employee will be created automatically.`);
      setHotReload((prev) => prev + 1);
    } catch (err: any) {
      message.error(err.message || "Something went wrong.");
    } finally {
      setHiringId(null);
    }
  };

  // Fetch Ranked Candidates via Custom Hook
  const {
    applications,
    total,
    loading: loadingApps,
  } = useGetRankedCandidates(
    id,
    currentPage,
    pageSize,
    statusFilter,
    undefined,
    hotReload,
  );

  if (loadingJob) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full min-h-[500px]">
        <Spin size="large" />
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full min-h-[500px] text-red-500">
        Job not found or an error occurred.
      </div>
    );
  }

  // Helper to render AI Score Badge
  const renderScoreBadge = (raw?: number | string) => {
    const score = toNum(raw);
    if (score === undefined || score === null)
      return <span className="font-medium text-gray-400">N/A</span>;
    let colorClass = "bg-red-50 text-red-600 border-red-200";
    if (score >= 80) colorClass = "bg-green-50 text-green-600 border-green-200";
    else if (score >= 50) colorClass = "bg-yellow-50 text-yellow-600 border-yellow-200";

    return (
      <div
        className={`inline-flex items-center justify-center px-3 py-1.5 border rounded-lg font-bold text-[15px] ${colorClass}`}
      >
        {score.toFixed(2)}%
      </div>
    );
  };

  const toNum = (v?: number | string) => (v !== undefined && v !== null ? parseFloat(String(v)) : undefined);

  // Map experienceMatchStatus from API to display label + bar width + color
  const getExpInfo = (status?: string): { label: string; barPercent: number; color: string } | null => {
    if (!status) return null;
    const s = status.toUpperCase().replace(/\s+/g, "_");
    const map: Record<string, { label: string; barPercent: number; color: string }> = {
      OUTSTANDING:           { label: "OUTSTANDING",  barPercent: 95, color: "bg-slate-100 text-slate-600" },
      EXCEEDS_REQUIREMENTS:  { label: "EXCEEDS REQ",  barPercent: 80, color: "bg-slate-100 text-slate-600" },
      EXCEEDS_REQUIREMENT:   { label: "EXCEEDS REQ",  barPercent: 80, color: "bg-slate-100 text-slate-600" },
      MEETS_REQUIREMENTS:    { label: "MEETS REQ",    barPercent: 60, color: "bg-slate-100 text-slate-600" },
      MEETS_REQUIREMENT:     { label: "MEETS REQ",    barPercent: 60, color: "bg-slate-100 text-slate-600" },
      GAP_FOUND:             { label: "GAP FOUND",    barPercent: 25, color: "bg-red-50 text-red-400" },
      INSUFFICIENT:          { label: "INSUFFICIENT", barPercent: 15, color: "bg-red-50 text-red-400" },
    };
    return map[s] ?? { label: status.replace(/_/g, " "), barPercent: 40, color: "bg-slate-100 text-slate-600" };
  };

  // Helper to render match details with progress bars
  const renderMatchDetails = (rawSkillPercent?: number | string, expStatus?: string) => {
    const skillPercent = toNum(rawSkillPercent);
    const expInfo = getExpInfo(expStatus);
    const hasSkill = skillPercent !== undefined && skillPercent !== null;
    return (
      <div className="flex flex-col min-w-0 gap-2">
        {hasSkill && (
          <div className="flex items-center gap-2">
            <span className="w-8 text-[11px] text-gray-400 shrink-0">Skills</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1d7a8a] rounded-full"
                style={{ width: `${Math.min(skillPercent!, 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 whitespace-nowrap">
              {skillPercent!.toFixed(0)}%
            </span>
          </div>
        )}
        {expInfo && (
          <div className="flex items-center gap-2">
            <span className="w-8 text-[11px] text-gray-400 shrink-0">Exp</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${expInfo.barPercent}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${expInfo.color} whitespace-nowrap`}>
              {expInfo.label}
            </span>
          </div>
        )}
        {!hasSkill && !expInfo && (
          <span className="text-xs text-gray-400">No data</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full p-4 mt-2">
      <div className="w-full p-4 bg-white border md:p-8 rounded-lg border-gray-100/50">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] md:text-4xl md:leading-tight">
              Candidates for {job.jobTitleName || job.title}
            </h1>
            <p className="mt-1.5 text-[14px] font-medium text-[#64748B]">
              Total {total} applicants evaluated by AI
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_46px] gap-3">
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search by name or email (Client-side draft)..."
              className="!h-11 !rounded-lg !bg-white !border-white hover:!border-blue-200 focus:!border-blue-300 shadow-sm"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />

            <Select
              value={statusFilter}
              className="w-full shadow-sm [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-white hover:[&_.ant-select-selector]:!border-blue-200 [&_.ant-select-selection-item]:!font-medium [&_.ant-select-selection-item]:!text-gray-600 [&_.ant-select-selection-item]:!leading-[44px]"
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Statuses", value: "ALL" },
                { label: "Matched successfully", value: "MATCHED" },
                { label: "Processing CV", value: "PARSING" },
              ]}
            />

            <Button
              className="!h-11 !w-full !p-0 !rounded-lg !border-white !bg-white shadow-sm !text-gray-500 hover:!text-blue-500 hover:!border-blue-200"
              onClick={() => setHotReload((prev) => prev + 1)}
            >
              <SyncOutlined />
            </Button>
          </div>
        </div>

        {/* Candidate List Table */}
        <div className="overflow-hidden bg-white border border-[#F1F5F9] rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_1fr] gap-4 px-8 py-5 text-[11px] font-bold tracking-[0.05em] text-[#94A3B8] uppercase bg-white border-b border-[#F1F5F9]">
            <span>Candidate Info</span>
            <span>Contact</span>
            <span className="text-center">Match Score</span>
            <span>Match Details</span>
            <span className="text-right">Action</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#F1F5F9]">
            {loadingApps ? (
              <div className="px-8 py-16 text-center">
                <Spin />
              </div>
            ) : applications.length === 0 ? (
              <div className="px-8 py-16 text-center text-gray-500">
                No candidates matched your current filters.
              </div>
            ) : (
              applications
                // (Tạm thời map filter theo keyword client-side nếu cần, thực tế API GetRanked nên có query keyword)
                .filter(
                  (app) =>
                    app.candidate.fullName
                      .toLowerCase()
                      .includes(keyword.toLowerCase()) ||
                    app.candidate.email
                      .toLowerCase()
                      .includes(keyword.toLowerCase()),
                )
                .map((app) => (
                  <div
                    key={app.id}
                    className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr_1.5fr_1fr] gap-4 px-8 py-6 items-center hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* Candidate Info */}
                    <div className="flex items-center min-w-0 gap-2">
                      <span className="text-[14px] font-bold text-[#1A1A1A] truncate">
                        {app.candidate.fullName}
                      </span>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col text-[13px] text-[#334155] min-w-0">
                      <span className="font-semibold truncate">{app.candidate.email}</span>
                      <span className="text-gray-400 mt-0.5">
                        {app.candidate.phoneNumber || "—"}
                      </span>
                    </div>

                    {/* AI Score */}
                    <div className="flex justify-start md:justify-center">
                      {renderScoreBadge(app.matchScore)}
                    </div>

                    {/* Match Details */}
                    {renderMatchDetails(app.skillMatchPercent, app.experienceMatchStatus)}

                    {/* Action */}
                    <div className="flex justify-start gap-2 md:justify-end" onClick={(e) => e.stopPropagation()}>
                      {app.status !== "HIRED" && (
                        <Button
                          className="!h-[38px] !rounded-lg !px-3 !font-bold !border-none !bg-green-50 hover:!bg-green-100 !text-green-600"
                          loading={hiringId === app.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHire(app);
                          }}
                        >
                          <UserAddOutlined className="text-[14px]" /> Hire
                        </Button>
                      )}
                      <Button
                        className="!h-[38px] !rounded-lg !px-3 !font-bold !border-none !bg-blue-50 hover:!bg-blue-100 !text-blue-500"
                        onClick={() => setSelectedApp(app)}
                      >
                        <EyeOutlined className="text-[14px]" />
                      </Button>
                      <Button
                        className="!h-[38px] !rounded-lg !px-3 !font-bold !border-none !bg-blue-50 hover:!bg-blue-100 !text-blue-500"
                        disabled={!app.candidate.storageKey}
                        onClick={() => app.candidate.storageKey && openCv(app.candidate.storageKey)}
                      >
                        <FileTextOutlined className="text-[14px]" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {!loadingApps && total > 0 && (
          <div className="flex justify-end mt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      {/* Candidate Detail Drawer */}
      <Drawer
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        width={520}
        title={null}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        {selectedApp && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="px-6 py-6 bg-gradient-to-r from-slate-800 to-slate-700">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white truncate">{selectedApp.candidate.fullName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {renderScoreBadge(selectedApp.matchScore)}
                    <span className="text-xs text-slate-300">AI Match Score</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-xl leading-none text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">

              {/* Contact */}
              <section>
                <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-[#334155]">
                    <MailOutlined className="text-gray-400 shrink-0" />
                    <span className="break-all">{selectedApp.candidate.email}</span>
                  </div>
                  {selectedApp.candidate.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm text-[#334155]">
                      <PhoneOutlined className="text-gray-400 shrink-0" />
                      <span>{selectedApp.candidate.phoneNumber}</span>
                    </div>
                  )}
                  {selectedApp.candidate.profileUrl && (
                    <div className="flex items-center gap-3 text-sm">
                      <LinkOutlined className="text-gray-400 shrink-0" />
                      <a href={selectedApp.candidate.profileUrl} target="_blank" rel="noreferrer"
                        className="text-blue-500 break-all hover:underline">
                        {selectedApp.candidate.profileUrl}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <CalendarOutlined className="shrink-0" />
                    <span>Applied {new Date(selectedApp.createDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </section>

              {/* Summary */}
              {selectedApp.candidate.summary && (
                <section>
                  <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Profile Summary</h3>
                  <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">
                    {selectedApp.candidate.summary}
                  </p>
                </section>
              )}

              {/* Cover Letter */}
              {selectedApp.candidate.coverLetter && (
                <section>
                  <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Cover Letter</h3>
                  <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-100 rounded-xl p-4">
                    {selectedApp.candidate.coverLetter}
                  </p>
                </section>
              )}

              {/* Education */}
              {selectedApp.candidate.metadata?.education && selectedApp.candidate.metadata.education.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Education</h3>
                  <div className="space-y-3">
                    {selectedApp.candidate.metadata.education.map((edu, i) => (
                      <div key={i} className="p-3 border rounded-xl bg-slate-50 border-slate-100">
                        <p className="text-sm font-semibold text-[#1A1A1A]">{edu.degree}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{edu.school}</p>
                        {edu.gpa && edu.gpa !== "null" && (
                          <p className="text-xs text-gray-400 mt-0.5">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {selectedApp.candidate.metadata?.experience && selectedApp.candidate.metadata.experience.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Experience</h3>
                  <div className="space-y-3">
                    {selectedApp.candidate.metadata.experience.map((exp, i) => (
                      <div key={i} className="p-3 border rounded-xl bg-slate-50 border-slate-100">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[#1A1A1A]">{exp.position}</p>
                            <p className="text-xs font-medium text-blue-500 mt-0.5">{exp.company}</p>
                          </div>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">{exp.duration}</span>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-xs leading-relaxed text-gray-500">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* AI Analysis */}
              <section>
                <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">AI Analysis</h3>
                <div className="p-3 space-y-3 border rounded-xl bg-slate-50 border-slate-100">
                  {renderMatchDetails(selectedApp.skillMatchPercent, selectedApp.experienceMatchStatus)}
                </div>
              </section>

              {/* Match Reason */}
              {selectedApp.matchReason && (
                <section>
                  <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Match Reason</h3>
                  <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-100 rounded-xl p-4">
                    {selectedApp.matchReason}
                  </p>
                </section>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="flex gap-2 px-6 py-4 border-t border-slate-100">
              <Button
                icon={<FileTextOutlined />}
                className="flex-1 !h-10 !rounded-lg !border-blue-200 !text-blue-500 hover:!border-blue-400"
                disabled={!selectedApp.candidate.storageKey}
                onClick={() => selectedApp.candidate.storageKey && openCv(selectedApp.candidate.storageKey)}
              >
                View CV
              </Button>
              <Button
                onClick={() => setSelectedApp(null)}
                className="!h-10 !rounded-lg !border-slate-200 !text-slate-500"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
