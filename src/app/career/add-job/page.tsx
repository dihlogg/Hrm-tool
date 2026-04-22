"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { Button, message, notification, Select, DatePicker, Spin } from "antd";
import { useCreateJob } from "@/hooks/ats/jobs/useCreateJob";
import {
  CreateJobDto,
  EmploymentType,
  JobStatus,
} from "@/hooks/ats/jobs/JobDto";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import { useJobTitles } from "@/hooks/employees/job-titles/useJobTitles";
import { useSubUnits } from "@/hooks/employees/sub-units/useSubUnits";
import { useGetAllSkills } from "@/hooks/ats/skills/useGetAllSkills";

const { Option } = Select;

export default function AddJobPage() {
  const router = useRouter();
  const { createJob } = useCreateJob();
  const { employee } = useAuthContext();
  const { jobTitles } = useJobTitles();
  const { subUnits } = useSubUnits();

  const { skills, loading: loadingSkills } = useGetAllSkills();

  const [api, contextHolder] = notification.useNotification();

  const [quillLoaded, setQuillLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const descRef = useRef<HTMLDivElement>(null);
  const respRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<HTMLDivElement>(null);

  const quillDescInstance = useRef<any>(null);
  const quillRespInstance = useRef<any>(null);
  const quillReqInstance = useRef<any>(null);

  const [formErrors, setFormErrors] = useState<{
    level?: string;
    employmentType?: string;
    status?: string;
    jobTitleId?: string;
    subUnitId?: string;
  }>({});

  const [level, setLevel] = useState<string | undefined>(undefined);
  const [employmentType, setEmploymentType] = useState<
    EmploymentType | undefined
  >(undefined);
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [status, setStatus] = useState<JobStatus | undefined>(undefined);

  const [jobTitleId, setJobTitleId] = useState<string | undefined>(undefined);
  const [jobTitleName, setJobTitleName] = useState<string>("");

  const [subUnitId, setSubUnitId] = useState<string | undefined>(undefined);
  const [subUnitName, setSubUnitName] = useState<string>("");

  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");

  type SkillRow = {
    skillId: string;
    skillName: string;
    years: number | "";
    importance: "Must-have" | "Nice-to-have";
  };

  const [skillRows, setSkillRows] = useState<SkillRow[]>([
    { skillId: "", skillName: "", years: "", importance: "Must-have" },
  ]);

  const skillOptions = skills.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const addSkillRow = () => {
    setSkillRows((prev) => [
      ...prev,
      { skillId: "", skillName: "", years: "", importance: "Must-have" },
    ]);
  };

  const removeSkillRow = (index: number) => {
    setSkillRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSkillRow = <K extends keyof SkillRow>(
    index: number,
    field: K,
    value: SkillRow[K],
  ) => {
    setSkillRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (quillLoaded && typeof window !== "undefined" && (window as any).Quill) {
      const Quill = (window as any).Quill;
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ];

      if (descRef.current && !quillDescInstance.current) {
        quillDescInstance.current = new Quill(descRef.current, {
          theme: "snow",
          modules: { toolbar: toolbarOptions },
          placeholder:
            "Describe the mission, the impact, and the day-to-day journey...",
        });
        quillDescInstance.current.on("text-change", () => {
          setDescription(quillDescInstance.current.root.innerHTML);
        });
      }

      if (respRef.current && !quillRespInstance.current) {
        quillRespInstance.current = new Quill(respRef.current, {
          theme: "snow",
          modules: { toolbar: toolbarOptions },
          placeholder: "List the essential day-to-day responsibilities...",
        });
        quillRespInstance.current.on("text-change", () => {
          setResponsibilities(quillRespInstance.current.root.innerHTML);
        });
      }

      if (reqRef.current && !quillReqInstance.current) {
        quillReqInstance.current = new Quill(reqRef.current, {
          theme: "snow",
          modules: { toolbar: toolbarOptions },
          placeholder:
            "List the essential skills and architectural experience needed...",
        });
        quillReqInstance.current.on("text-change", () => {
          setRequirements(quillReqInstance.current.root.innerHTML);
        });
      }
    }
  }, [quillLoaded]);

  const resetForm = () => {
    setLevel(undefined);
    setEmploymentType(undefined);
    setLocation("");
    setFromDate(null);
    setToDate(null);
    setStatus(undefined);
    setJobTitleId(undefined);
    setJobTitleName("");
    setSubUnitId(undefined);
    setSubUnitName("");
    setDescription("");
    setResponsibilities("");
    setRequirements("");
    setBenefits("");
    setSkillRows([
      { skillId: "", skillName: "", years: "", importance: "Must-have" },
    ]);
    setFormErrors({});

    if (quillDescInstance.current) quillDescInstance.current.setContents([]);
    if (quillRespInstance.current) quillRespInstance.current.setContents([]);
    if (quillReqInstance.current) quillReqInstance.current.setContents([]);
  };

  const handleSubmit = async () => {
    const errors: typeof formErrors = {};

    if (!jobTitleId) errors.jobTitleId = "*Required";
    if (!level) errors.level = "*Required";
    if (!employmentType) errors.employmentType = "*Required";
    if (!status) errors.status = "*Required";
    if (!subUnitId) errors.subUnitId = "*Required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.warning("Please fill in all required fields before submitting!");
      return;
    }

    setSubmitting(true);
    try {
      const formattedSkills = skillRows
        .filter((r) => r.skillId !== "")
        .map((r) => ({
          skillId: r.skillId,
          skillName: r.skillName,
          experienceYears: r.years === "" ? 0 : Number(r.years),
          // có thể cân nhắc lưu 'importance' vào bảng EntitySkill sau này
        }));

      const payload: CreateJobDto = {
        employeeId: employee?.id,
        jobTitleId,
        jobTitleName,
        subUnitId,
        subUnitName,
        level,
        employmentType,
        location,
        fromDate: fromDate ? fromDate.toISOString() : null,
        toDate: toDate ? toDate.toISOString() : null,
        status,
        description,
        responsibilities,
        requirements,
        benefits,

        skills: formattedSkills,

        parsedJson: {
          skills: skillRows.filter((r) => r.skillId !== ""),
        },
      };

      await createJob(payload);
      api.success({
        message: "Opportunity created successfully!",
        description: `Position ${level} ${jobTitleName} has been added by ${employee?.firstName} ${employee?.lastName}.`,
        placement: "bottomLeft",
      });
      resetForm();

      router.push("/career");
    } catch (err: unknown) {
      let msg = "An unknown error occurred.";
      if (err instanceof Error) msg = err.message;
      api.error({
        message: "Failed to create opportunity!",
        description: msg,
        placement: "bottomLeft",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}

      <link
        href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
        rel="stylesheet"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"
        strategy="lazyOnload"
        onLoad={() => setQuillLoaded(true)}
      />

      <div className="relative flex-1 w-full p-4 mt-2">
        {submitting && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
            <Spin size="large" />
            <p className="mt-3 text-sm font-medium text-gray-500 animate-pulse">
              Creating opportunity…
            </p>
          </div>
        )}
        <div className="w-full px-6 py-8 bg-white border border-gray-100 shadow-sm rounded-2xl md:px-10 md:py-10">
          {/* Header */}
          <div className="mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              Create Opportunity
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
              Define the requirements and responsibilities for your next great
              hire.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {/* Section 01: Job Details */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded text-base tracking-wide">
                  01
                </span>
                <h2 className="!mt-2 text-xl font-bold text-gray-800">
                  Details
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                {/* Job Title */}
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Job Title*
                    {formErrors.jobTitleId && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.jobTitleId}
                      </span>
                    )}
                  </label>
                  <Select
                    value={jobTitleId}
                    className="w-full"
                    placeholder="--Select--"
                    allowClear
                    onChange={(value) => {
                      setJobTitleId(value);
                      const selectedJob = jobTitles.find(
                        (job) => job.id === value,
                      );
                      setJobTitleName(selectedJob?.name || "");
                      setFormErrors((prev) => ({
                        ...prev,
                        jobTitleId: undefined,
                      }));
                    }}
                  >
                    {jobTitles.map((job) => (
                      <Option key={job.id} value={job.id}>
                        {job.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Level */}
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Level*
                    {formErrors.level && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.level}
                      </span>
                    )}
                  </label>
                  <Select
                    value={level}
                    className="w-full"
                    placeholder="--Select--"
                    allowClear
                    onChange={(value) => {
                      setLevel(value);
                      setFormErrors((prev) => ({ ...prev, level: undefined }));
                    }}
                  >
                    <Option value="Intern">Intern</Option>
                    <Option value="Fresher">Fresher</Option>
                    <Option value="Junior">Junior</Option>
                    <Option value="Mid-Level">Mid-Level</Option>
                    <Option value="Senior">Senior</Option>
                  </Select>
                </div>

                {/* Location */}
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Location
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Da Nang City"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Sub Unit */}
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Department*
                    {formErrors.subUnitId && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.subUnitId}
                      </span>
                    )}
                  </label>
                  <Select
                    value={subUnitId}
                    className="w-full"
                    placeholder="--Select--"
                    allowClear
                    onChange={(value) => {
                      setSubUnitId(value);
                      const selectedSub = subUnits.find(
                        (sub) => sub.id === value,
                      );
                      setSubUnitName(selectedSub?.name || "");
                      setFormErrors((prev) => ({
                        ...prev,
                        subUnitId: undefined,
                      }));
                    }}
                  >
                    {subUnits.map((sub) => (
                      <Option key={sub.id} value={sub.id}>
                        {sub.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Job Type */}
                <div className="flex flex-col items-start w-full">
                  <label className="flex justify-between w-full mb-2 text-sm text-gray-500 font-small">
                    Job Type*
                    {formErrors.employmentType && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.employmentType}
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    {[
                      { label: "Full-Time", value: EmploymentType.FULL_TIME },
                      { label: "Part-Time", value: EmploymentType.PART_TIME },
                      { label: "Remote", value: EmploymentType.REMOTE },
                    ].map((type) => {
                      const isActive = employmentType === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setEmploymentType(type.value);
                            setFormErrors((prev) => ({
                              ...prev,
                              employmentType: undefined,
                            }));
                          }}
                          className={`px-5 py-2 text-sm rounded-full transition-colors cursor-pointer ${
                            isActive
                              ? "bg-orange-50 !text-orange-400 border border-orange-200 font-medium"
                              : "bg-gray-50 text-black hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Status*
                    {formErrors.status && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.status}
                      </span>
                    )}
                  </label>
                  <Select
                    value={status}
                    className="w-full"
                    placeholder="--Select--"
                    allowClear
                    onChange={(value) => {
                      setStatus(value);
                      setFormErrors((prev) => ({ ...prev, status: undefined }));
                    }}
                  >
                    <Option value={JobStatus.OPEN}>Open</Option>
                    <Option value={JobStatus.CLOSED}>Closed</Option>
                  </Select>
                </div>

                {/* Valid From */}
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    From Date
                  </label>
                  <DatePicker
                    format={(value) =>
                      value ? value.format("DD-MMM-YYYY").toUpperCase() : ""
                    }
                    className="w-full px-3 py-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400 custom-select"
                    placeholder="--Select--"
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                  />
                </div>

                {/* Valid Until */}
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    To Date
                  </label>
                  <DatePicker
                    format={(value) =>
                      value ? value.format("DD-MMM-YYYY").toUpperCase() : ""
                    }
                    className="w-full px-3 py-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400 custom-select"
                    placeholder="--Select--"
                    value={toDate}
                    disabledDate={(current) =>
                      fromDate ? current.isBefore(fromDate, "day") : false
                    }
                    onChange={(date) => setToDate(date)}
                  />
                </div>
              </div>
            </div>

            {/* --- Section 02: The Brief --- */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded text-base tracking-wide">
                  02
                </span>
                <h2 className="!mt-2 text-xl font-bold text-gray-800">Brief</h2>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <div className="w-full">
                  <label className="block w-full mb-2 text-sm font-semibold text-gray-600">
                    Job Description
                  </label>
                  <div className="bg-white rounded-md">
                    {mounted && quillLoaded && (
                      <div ref={descRef} className="h-[200px]" />
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <label className="block w-full mb-2 text-sm font-semibold text-gray-600">
                    Key Responsibilities
                  </label>
                  <div className="bg-white rounded-md">
                    {mounted && quillLoaded && (
                      <div ref={respRef} className="h-[200px]" />
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <label className="block w-full mb-2 text-sm font-semibold text-gray-600">
                    Key Requirements
                  </label>
                  <div className="bg-white rounded-md">
                    {mounted && quillLoaded && (
                      <div ref={reqRef} className="h-[200px]" />
                    )}
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="w-full">
                  <label className="block w-full mb-3 text-sm font-semibold text-gray-600">
                    Skills &amp; Expertise
                  </label>
                  <div className="flex flex-col gap-3">
                    {skillRows.map((row, index) => (
                      <div key={index} className="flex items-center gap-6">
                        {/* Skill name */}
                        <Select
                          className="flex-1"
                          placeholder="Select skill"
                          value={row.skillId || undefined}
                          showSearch
                          allowClear
                          loading={loadingSkills}
                          options={skillOptions}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={(val, option: any) => {
                            updateSkillRow(index, "skillId", val ?? "");
                            updateSkillRow(
                              index,
                              "skillName",
                              option?.label ?? "",
                            );
                          }}
                        />

                        {/* Years */}
                        <input
                          type="number"
                          min={0}
                          max={50}
                          placeholder="0"
                          value={row.years}
                          onChange={(e) =>
                            updateSkillRow(
                              index,
                              "years",
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                          className="w-16 px-2 py-1 text-sm text-center border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <span className="text-xs font-medium text-gray-400">
                          YRS
                        </span>

                        {/* Importance */}
                        <Select
                          className="w-40"
                          value={row.importance}
                          onChange={(val) =>
                            updateSkillRow(index, "importance", val)
                          }
                          options={[
                            { label: "Must-have", value: "Must-have" },
                            { label: "Nice-to-have", value: "Nice-to-have" },
                          ]}
                        />

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeSkillRow(index)}
                          className="text-lg leading-none text-gray-300 transition-colors cursor-pointer hover:text-red-400"
                          aria-label="Remove skill"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addSkillRow}
                      className="self-start mt-1 text-sm font-medium text-blue-500 cursor-pointer hover:text-blue-600"
                    >
                      + Add another skill
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm italic font-medium text-gray-500">
                * Required
              </span>
              <div className="flex justify-end gap-3">
                <Button
                  type="primary"
                  shape="round"
                  size="middle"
                  ghost
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  size="middle"
                  className="text-white bg-blue-500 hover:bg-blue-600"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  + Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
