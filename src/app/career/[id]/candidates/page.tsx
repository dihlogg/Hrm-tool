"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Input, Select, Spin } from "antd";
import {
  FileTextOutlined,
  FilterOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useGetJobById } from "@/hooks/ats/jobs/useGetJobById";

type CandidateStatus = "Applied" | "Screening" | "Interviewing" | "Selected";
type ExperienceTier = "Junior" | "Mid-Level" | "Senior";

type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  education: string;
  experienceYears: number;
  status: CandidateStatus;
  experienceTier: ExperienceTier;
  profileUrl?: string;
};

const CANDIDATES: Candidate[] = [
  {
    id: "1",
    fullName: "Sarah Jenkins",
    email: "sarah.j@email.com",
    phoneNumber: "0901234567",
    education: "Bachelor of CS",
    experienceYears: 5,
    status: "Interviewing",
    experienceTier: "Senior",
    profileUrl: "#",
  },
  {
    id: "2",
    fullName: "Marcus Chen",
    email: "m.chen@techmail.com",
    phoneNumber: "0987654321",
    education: "Masters in QA",
    experienceYears: 3.5,
    status: "Screening",
    experienceTier: "Mid-Level",
    profileUrl: "#",
  },
  {
    id: "3",
    fullName: "Elena Rodriguez",
    email: "elena.rodriguez@domain.com",
    phoneNumber: "0912233445",
    education: "PhD in Software Eng",
    experienceYears: 8,
    status: "Selected",
    experienceTier: "Senior",
    profileUrl: "#",
  },
  {
    id: "4",
    fullName: "James Wilson",
    email: "j.wilson94@provider.net",
    phoneNumber: "0944332211",
    education: "B.Eng Computer Sci",
    experienceYears: 2,
    status: "Applied",
    experienceTier: "Junior",
    profileUrl: "#",
  },
];

export default function CandidateListPage() {
  const params = useParams();
  const id = params?.id as string;

  const { job, loading, error } = useGetJobById(id);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<CandidateStatus | "ALL">("ALL");
  const [experienceTier, setExperienceTier] = useState<ExperienceTier | "ALL">(
    "ALL",
  );
  const filteredCandidates = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return CANDIDATES.filter((candidate) => {
      const hitKeyword =
        normalizedKeyword.length === 0 ||
        candidate.fullName.toLowerCase().includes(normalizedKeyword) ||
        candidate.email.toLowerCase().includes(normalizedKeyword) ||
        candidate.education.toLowerCase().includes(normalizedKeyword);

      const hitStatus = status === "ALL" || candidate.status === status;
      const hitExperience =
        experienceTier === "ALL" || candidate.experienceTier === experienceTier;

      return hitKeyword && hitStatus && hitExperience;
    });
  }, [keyword, status, experienceTier]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full min-h-[500px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full min-h-[500px] text-red-500">
        Job not found or an error occurred.
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-4 mt-2">
      <div className="w-full p-4 bg-white border md:p-8 rounded-2xl border-gray-100/50">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] md:text-4xl md:leading-tight">
              Candidates for {job.jobTitleName || job.title}
            </h1>
            <p className="mt-1.5 text-[14px] font-medium text-[#64748B]">
              Total 42 applicants in the current cycle
            </p>
          </div>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            className="!bg-[#F97316] hover:!bg-[#EA580C] !text-white !border-none !h-11 !px-7 !rounded-lg !font-semibold shadow-md shadow-orange-500/20"
          >
            Add Candidate
          </Button>
        </div>

        {/* Filter Bar */}
        {/* Đã sửa: grid-cols-[1fr,150px,180px,46px] thành grid-cols-[1fr_150px_180px_46px] */}
        <div className="mb-8 p-3 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_180px_46px] gap-3">
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search by name, email or skill..."
              className="!h-11 !rounded-lg !bg-white !border-white hover:!border-orange-200 focus:!border-orange-300 shadow-sm"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />

            <Select
              value={status}
              className="w-full shadow-sm [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-white hover:[&_.ant-select-selector]:!border-orange-200 [&_.ant-select-selection-item]:!font-medium [&_.ant-select-selection-item]:!text-gray-600 [&_.ant-select-selection-item]:!leading-[44px]"
              onChange={(value) => setStatus(value)}
              options={[
                { label: "All Statuses", value: "ALL" },
                { label: "Applied", value: "Applied" },
                { label: "Screening", value: "Screening" },
                { label: "Interviewing", value: "Interviewing" },
                { label: "Selected", value: "Selected" },
              ]}
            />

            <Select
              value={experienceTier}
              className="w-full shadow-sm [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-white hover:[&_.ant-select-selector]:!border-orange-200 [&_.ant-select-selection-item]:!font-medium [&_.ant-select-selection-item]:!text-gray-600 [&_.ant-select-selection-item]:!leading-[44px]"
              onChange={(value) => setExperienceTier(value)}
              options={[
                { label: "Experience Level", value: "ALL" },
                { label: "Junior (0-2 years)", value: "Junior" },
                { label: "Mid-Level (3-5 years)", value: "Mid-Level" },
                { label: "Senior (5+ years)", value: "Senior" },
              ]}
            />

            <Button className="!h-11 !w-full !p-0 !rounded-lg !border-white !bg-white shadow-sm !text-gray-500 hover:!text-orange-500 hover:!border-orange-200">
              <FilterOutlined />
            </Button>
          </div>
        </div>

        {/* Candidate List Table */}
        <div className="overflow-hidden bg-white border border-[#F1F5F9] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Table Header */}
          {/* Đã sửa: grid-cols-[1.4fr,1.6fr,1.2fr,1.3fr,1fr,1.2fr] thành grid-cols-[1.4fr_1.6fr_1.2fr_1.3fr_1fr_1.2fr] */}
          <div className="hidden md:grid grid-cols-[1.4fr_1.6fr_1.2fr_1.3fr_1fr_1.2fr] gap-4 px-8 py-5 text-[11px] font-bold tracking-[0.05em] text-[#94A3B8] uppercase bg-white border-b border-[#F1F5F9]">
            <span>Name</span>
            <span>Email</span>
            <span>Phone Number</span>
            <span>Education</span>
            <span>Experience</span>
            <span className="text-right">Action</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#F1F5F9]">
            {filteredCandidates.length === 0 ? (
              <div className="px-8 py-16 text-center text-gray-500">
                No candidates matched your current filters.
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="grid grid-cols-1 md:grid-cols-[1.4fr_1.6fr_1.2fr_1.3fr_1fr_1.2fr] gap-4 px-8 py-6 items-center hover:bg-slate-50/50 transition-colors"
                >
                  {/* Name */}
                  <div className="min-w-0">
                    <span className="md:hidden mr-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                      Name:
                    </span>
                    <span className="text-[14px] font-semibold text-[#F97316]">
                      {candidate.fullName}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="text-[14px] font-semibold text-[#334155] break-all">
                    <span className="md:hidden mr-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                      Email:
                    </span>
                    {candidate.email}
                  </div>

                  {/* Phone */}
                  <div className="text-[14px] font-semibold text-[#334155]">
                    <span className="md:hidden mr-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                      Phone Number:
                    </span>
                    {candidate.phoneNumber}
                  </div>

                  {/* Education */}
                  <div className="text-[14px] font-semibold text-[#334155]">
                    <span className="md:hidden mr-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                      Education:
                    </span>
                    {candidate.education}
                  </div>

                  {/* Experience */}
                  <div className="text-[14px] font-semibold text-[#334155]">
                    <span className="md:hidden mr-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]">
                      Experience:
                    </span>
                    {candidate.experienceYears}{" "}
                    {candidate.experienceYears === 1 ? "Year" : "Years"}
                  </div>

                  {/* Action */}
                  <div className="flex justify-start md:justify-end">
                    <Button
                      className={`!h-[38px] !rounded-lg !px-4 !font-bold !border-none ${
                        candidate.status === "Selected"
                          ? "!bg-[#F97316] hover:!bg-[#EA580C] !text-white"
                          : "!bg-[#FFF7ED] hover:!bg-[#FFEDD5] !text-[#F97316]"
                      }`}
                      onClick={() => {
                        if (candidate.profileUrl) {
                          window.open(candidate.profileUrl, "_blank");
                        }
                      }}
                    >
                      <span className="flex items-center gap-1.5 leading-tight">
                        <FileTextOutlined className="text-[14px]" />
                        <span className="text-[12px] whitespace-nowrap">View CV</span>
                      </span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}