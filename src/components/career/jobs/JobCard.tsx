"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { EmploymentType, JobDto } from "@/hooks/ats/jobs/JobDto";

interface JobCardProps {
  job: JobDto;
}

const formatEmploymentType = (type: EmploymentType) => {
  switch (type) {
    case EmploymentType.FULL_TIME:
      return "FULL TIME";
    case EmploymentType.PART_TIME:
      return "PART TIME";
    case EmploymentType.REMOTE:
      return "REMOTE";
    default:
      return type;
  }
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-xl md:flex-row md:items-start hover:shadow-md group">
      <div className="flex flex-col items-start w-full pr-2 overflow-hidden md:w-4/12">
        <div className="flex flex-wrap items-center min-h-[24px] gap-4">
          <span className="px-2 py-1 text-sm font-semibold leading-none tracking-wider text-white uppercase bg-orange-500 rounded-sm">
            {formatEmploymentType(job.employmentType)}
          </span>
          <span className="text-sm font-semibold leading-none tracking-wider text-orange-500 uppercase">
            {job.location || "DA NANG CITY"}
          </span>
        </div>

        <h3 className="w-full mt-3 text-lg font-medium text-gray-600 break-all transition-colors hover:text-orange-600">
          {job.jobTitleName}
        </h3>

        {(job.fromDate || job.toDate) && (
          <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-500">
            <CalendarOutlined className="text-gray-400" />
            <span>
              {job.fromDate ? dayjs(job.fromDate).format("DD MMM YYYY") : "N/A"}
              {" - "}
              {job.toDate ? dayjs(job.toDate).format("DD MMM YYYY") : "N/A"}
            </span>
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden md:w-5/12">
        <p className="pt-0.5 m-0 text-lg font-semibold text-gray-500 break-all line-clamp-3">
          {job.title ||
            job.description ||
            `Are you up to become a ${job.title} at LTD?`}
        </p>
      </div>

      <div className="flex justify-start w-full mt-2 md:w-3/12 md:justify-end md:mt-0 md:self-center">
        <Link
          href={`/career/${job.id}`}
          className="flex items-center gap-2 text-lg font-bold text-orange-500 transition-colors hover:text-orange-600"
        >
          Details
          <ArrowRightOutlined className="text-xs transition-transform rotate-45 group-hover:translate-x-1 group-hover:translate-y-1" />
        </Link>
      </div>
    </div>
  );
}
