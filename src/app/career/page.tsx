"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spin, Empty, Button, Input, Select, Checkbox } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useGetAllJobs } from "@/hooks/ats/jobs/useGetAllJobs";
import { EmploymentType } from "@/hooks/ats/jobs/JobDto";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Option } = Select;

export default function JobListPage() {
  const { jobs, loading, error } = useGetAllJobs();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [empType, setEmpType] = useState<string>("Full-time");
  const [levels, setLevels] = useState<string[]>([]);
  const safeJobs = jobs || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full min-h-[500px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full min-h-[500px] text-red-500">
        An error occurred: {error}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-4 mt-2">
      <div className="w-full px-6 py-8 bg-white border border-gray-100 shadow-sm rounded-2xl md:px-10 md:py-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              Architect Your{" "}
              <span className="text-orange-500">Next Career Move.</span>
            </h1>
            <Link href="/career/add-job">
              <Button
                type="primary"
                shape="round"
                size="middle"
                className="font-medium text-white bg-orange-500 border-none shadow-md hover:bg-orange-600"
              >
                + Post a Job
              </Button>
            </Link>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
            A curated workspace for the world&apos;s most ambitious digital
            builders, engineers, and designers.
          </p>
        </div>

        {/* Top Search Bar */}
        <div className="flex flex-col gap-3 p-3 mb-8 bg-white border border-gray-100 shadow-sm md:flex-row rounded-2xl">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Job title, company, or keywords"
            className="flex-1 py-3 text-base border-none bg-gray-50 rounded-xl hover:bg-gray-100 focus:bg-white"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Input
            prefix={<EnvironmentOutlined className="text-gray-400" />}
            placeholder="Location (Remote, Da Nang, SF)"
            className="flex-1 py-3 text-base border-none bg-gray-50 rounded-xl hover:bg-gray-100 focus:bg-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="flex items-center w-full md:w-40 h-[50px] bg-gray-50 rounded-xl px-2 transition-colors hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-200">
            <Select
              defaultValue="Full-time"
              variant="borderless"
              className="w-full text-base font-medium"
              onChange={(val) => setEmpType(val)}
            >
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
              <Option value="Contract">Contract</Option>
            </Select>
          </div>
          <Button
            type="primary"
            className="h-full px-8 text-base font-semibold bg-orange-500 border-none shadow-md hover:bg-orange-600 rounded-xl"
          >
            Find Workspace
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Filters */}
          <div className="flex flex-col w-full gap-8 md:w-64 shrink-0">
            {/* Experience Level */}
            <div>
              <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                Experience Level
              </h3>
              <Checkbox.Group
                className="flex flex-col gap-3"
                onChange={(checkedValues) =>
                  setLevels(checkedValues as string[])
                }
              >
                <Checkbox value="Senior" className="font-medium text-gray-600">
                  Senior (5+ years)
                </Checkbox>
                <Checkbox
                  value="Mid-Level"
                  className="font-medium text-gray-600"
                >
                  Mid-Level (3-5 years)
                </Checkbox>
                <Checkbox value="Junior" className="font-medium text-gray-600">
                  Junior (1-3 years)
                </Checkbox>
                <Checkbox value="Fresher" className="font-medium text-gray-600">
                  Fresher (0-1 years)
                </Checkbox>
                <Checkbox value="Intern" className="font-medium text-gray-600">
                  Intern
                </Checkbox>
              </Checkbox.Group>
            </div>
          </div>

          {/* Job List */}
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-800">
                {safeJobs.length} Available Opportunities
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <Select
                  defaultValue="recent"
                  variant="borderless"
                  className="font-sans font-semibold text-orange-600"
                >
                  <Option value="recent">Most Recent</Option>
                  <Option value="relevant">Most Relevant</Option>
                </Select>
              </div>
            </div>

            {safeJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <Empty
                  description={
                    <span className="text-gray-500">
                      No open positions currently available.
                    </span>
                  }
                />
              </div>
            ) : (
              safeJobs.map((job, idx) => {
                const empTypeStr =
                  job.employmentType === EmploymentType.FULL_TIME
                    ? "Full-time"
                    : job.employmentType === EmploymentType.PART_TIME
                      ? "Part-time"
                      : "Contract";

                const timeAgo = job.createDate
                  ? dayjs(job.createDate).fromNow()
                  : "Posted recently";

                return (
                  <div
                    key={job.id}
                    className="flex flex-col gap-4 p-5 transition-all duration-200 bg-white border border-gray-100 shadow-sm md:flex-row md:items-center rounded-2xl hover:shadow-md group"
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {job.jobTitleName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          {job.subUnitName || "LTD Tech"}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{timeAgo}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 text-xs font-semibold text-orange-700 rounded-lg bg-orange-50">
                          {empTypeStr}
                        </span>

                        {job.location && (
                          <span className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg">
                            {job.location}
                          </span>
                        )}

                        {job.level && (
                          <span className="px-3 py-1 text-xs font-semibold text-purple-700 rounded-lg bg-purple-50">
                            {job.level}
                          </span>
                        )}

                        {job.toDate && (
                          <span className="px-3 py-1 text-xs font-semibold text-red-600 rounded-lg bg-red-50">
                            Deadline: {dayjs(job.toDate).format("DD MMM YYYY")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 mt-4 md:mt-0 shrink-0">
                      <Link href={`/career/${job.id}`}>
                        <Button
                          type="primary"
                          className="h-10 px-6 font-semibold text-white bg-orange-500 border border-orange-500 shadow-sm rounded-xl hover:bg-orange-600"
                        >
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
