"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spin, Tag } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  SmileOutlined,
  HomeOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useGetJobById } from "@/hooks/ats/jobs/useGetJobById";
import { EmploymentType } from "@/hooks/ats/jobs/JobDto";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { job, loading, error } = useGetJobById(id);

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

  const formatEmpType = (type?: EmploymentType) => {
    if (type === EmploymentType.FULL_TIME) return "Full-Time";
    if (type === EmploymentType.PART_TIME) return "Part-Time";
    if (type === EmploymentType.REMOTE) return "Remote";
    return "Full-Time";
  };

  const formatEmpBadge = (type?: EmploymentType) => {
    if (type === EmploymentType.FULL_TIME) return "Full Time";
    if (type === EmploymentType.PART_TIME) return "Part Time";
    if (type === EmploymentType.REMOTE) return "Remote";
    return "Full Time";
  };

  const extractListItems = (htmlContent?: string) => {
    if (!htmlContent) return [];

    const liMatches = [...htmlContent.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    if (liMatches.length > 0) {
      return liMatches.map((m) => m[1].trim()).filter(Boolean);
    }

    const pMatches = [...htmlContent.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    if (pMatches.length > 0) {
      return pMatches
        .map((m) => m[1].trim())
        .filter((text) => text !== "<br>" && text !== "");
    }

    return [htmlContent];
  };

  const respList = extractListItems(job.responsibilities!);
  const reqList = extractListItems(job.requirements!);

  const listSkills =
    job.entitySkills?.map(
      (es) => es.standardizedName || es.skill?.name || "Unknown Skill",
    ) || [];

  const deadline = job.toDate ? dayjs(job.toDate).format("DD MMM YYYY") : null;

  const experienceLevel = job.level || "Senior (5+ yrs)";

  const defaultBenefits = [
    {
      icon: <SafetyCertificateOutlined className="text-lg text-blue-500" />,
      title: "Health & Dental",
      desc: "Full premium coverage for you and your family including vision and mental health.",
    },
    {
      icon: <SmileOutlined className="text-lg text-blue-500" />,
      title: "Unlimited PTO",
      desc: "Take the time you need to recharge. We encourage at least 4 weeks off a year.",
    },
    {
      icon: <HomeOutlined className="text-lg text-blue-500" />,
      title: "Remote Stipend",
      desc: "$2,000 yearly for your home office setup, ergonomic furniture, and high-speed internet.",
    },
    {
      icon: <ReadOutlined className="text-lg text-blue-500" />,
      title: "Learning Budget",
      desc: "$3,000 for courses, conferences, and books to help you grow professionally.",
    },
  ];

  return (
    <div className="relative flex-1 w-full p-4 mt-2">
      <div className="w-full px-6 py-8 bg-white border border-gray-100 shadow-sm rounded-lg md:px-10 md:py-10">
        {/* Back link */}
        <button
          onClick={() => router.push("/career")}
          className="inline-flex !pb-6 items-center gap-2 text-sm font-medium text-gray-500 transition-colors bg-transparent border-none cursor-pointer hover:text-blue-500"
        >
          <ArrowLeftOutlined className="text-xs" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Back to Job Feed
          </span>
        </button>
        {/* Header Section */}
        <header className="pb-6 mb-8 border-b border-gray-200">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
            <div className="space-y-3">
              {/* Badge + Time */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-bold tracking-wide text-blue-500 uppercase rounded-full bg-blue-50">
                  {formatEmpBadge(job.employmentType)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
                {job.jobTitleName || job.title || "Backend Developer"}
              </h1>

              {/* Company Info Row */}
              <div className="flex flex-wrap items-center text-sm font-semibold text-gray-500 gap-x-8 gap-y-3">
                <span className="flex items-center gap-1.5">
                  <EnvironmentOutlined className="text-base text-blue-500" />
                  {job.location || "Đà Nẵng"}
                </span>
                {deadline && (
                  <span className="px-3 py-1 text-xs font-semibold text-red-600 rounded-lg bg-red-50">
                    Deadline: {deadline}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                type="primary"
                onClick={() => router.push(`/career/${id}/apply`)}
                className="!bg-blue-500 hover:!bg-blue-600 !text-white !border-none !rounded-full !h-10 !px-6 font-semibold flex items-center gap-2 shadow-sm"
              >
                Apply Now <ArrowRightOutlined />
              </Button>
              <Button
                onClick={() => router.push(`/career/${id}/candidates`)}
                className="!rounded-full !h-10 !px-6 font-semibold"
              >
                View Candidates
              </Button>
            </div>
          </div>
        </header>

        {/* Multi-Column Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left / Main Column */}
          <div className="flex flex-col gap-10 lg:col-span-8">
            {/* About the Role */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                About the Role
              </h2>
              <div
                className="text-[15px] leading-relaxed text-gray-500 max-w-3xl break-all [overflow-wrap:anywhere] [&_*]:break-all"
                dangerouslySetInnerHTML={{
                  __html: job.description || "No description provided.",
                }}
              />
            </section>

            {/* Responsibilities */}
            <section>
              <h2 className="mb-5 text-2xl font-bold text-gray-900">
                Responsibilities
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {respList.map((resp, index) => (
                  <div
                    key={index}
                    className="flex items-start min-w-0 gap-3 p-5 transition-colors bg-white border border-gray-100 shadow-sm rounded-lg hover:border-blue-300 group"
                  >
                    <CheckCircleIcon />
                    <div
                      className="min-w-0 flex-1 text-sm leading-relaxed text-gray-600 break-all [overflow-wrap:anywhere] [&_*]:break-all [&>p]:m-0"
                      dangerouslySetInnerHTML={{ __html: resp }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="mb-5 text-2xl font-bold text-gray-900">
                Requirements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {reqList.map((req, index) => (
                  <div key={index} className="flex items-start min-w-0 gap-3">
                    <span className="shrink-0 text-blue-500 text-base leading-none mt-0.5">
                      ●
                    </span>
                    <div
                      className="min-w-0 flex-1 text-[15px] leading-relaxed text-gray-500 break-all [overflow-wrap:anywhere] [&_*]:break-all [&>p]:m-0"
                      dangerouslySetInnerHTML={{ __html: req }}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right / Sidebar Column */}
          <aside className="flex flex-col gap-6 lg:col-span-4">
            {/* Job Summary + Tech Stack */}
            <div className="p-6 space-y-5 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Job Summary</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Job Type</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatEmpType(job.employmentType)}
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Experience Level
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {experienceLevel}
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Remote Work</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Hybrid / Flexible
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Interview Process
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    3 Rounds
                  </span>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="pt-5 border-t border-gray-200">
                <h4 className="mb-3 text-sm font-bold text-gray-900">
                  Tech Stack & Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {listSkills.length > 0 ? (
                    listSkills.map((tech: string, index: number) => (
                      <Tag
                        key={index}
                        className="!bg-white !border-gray-200 !text-gray-700 !rounded-lg !px-3 !py-1 !text-sm !font-medium !m-0"
                      >
                        {tech}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">
                      Không có yêu cầu kỹ năng cụ thể
                    </span>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Benefits & Perks - Full Width */}
        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            Benefits & Perks
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {defaultBenefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 p-5 transition-all bg-white border border-gray-100 shadow-sm rounded-lg hover:shadow-md group"
              >
                <div className="flex items-center justify-center w-10 h-10 transition-transform bg-blue-50 rounded-lg group-hover:rotate-6">
                  {benefit.icon}
                </div>
                <h4 className="m-0 text-sm font-bold text-gray-900">
                  {benefit.title}
                </h4>
                <p className="m-0 text-xs leading-relaxed text-gray-500">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* Icon Component */
function CheckCircleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 mt-0.5"
    >
      <circle cx="12" cy="12" r="11" stroke="#3B82F6" strokeWidth="2" />
      <path
        d="M7.5 12.5L10.5 15L16.5 9"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
