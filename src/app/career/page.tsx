"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spin, Empty, Button, Input, Select, Checkbox, Pagination } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { EmploymentType } from "@/hooks/ats/jobs/JobDto";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetJobList } from "@/hooks/ats/jobs/useGetJobList";
import {
  getInitialJobFilters,
  JobFilters,
} from "@/hooks/ats/jobs/JobFiltersDto";
import { useJobTitles } from "@/hooks/employees/job-titles/useJobTitles";
import { useAuthContext } from "@/contexts/authContext";

dayjs.extend(relativeTime);

const { Option } = Select;

export default function JobListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [sortBy, setSortBy] = useState<string>("createDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const { userRoles } = useAuthContext();
  const isSuperAdmin = Array.isArray(userRoles) && userRoles.includes("Super Admin");
  const isAdmin = Array.isArray(userRoles) && userRoles.includes("Admin");
  const isAtLeastAdmin = isSuperAdmin || isAdmin;

  // Filters state
  const [filters, setFilters] = useState<JobFilters>(getInitialJobFilters());
  const [filterDrafts, setFilterDrafts] = useState<JobFilters>(
    getInitialJobFilters(),
  );

  const {
    jobs: safeJobs,
    total,
    loading,
    error,
  } = useGetJobList(currentPage, pageSize, sortBy, sortOrder, filters);

  const { jobTitles } = useJobTitles();

  const handleApplyFilter = () => {
    setFilters(filterDrafts);
    setCurrentPage(1);
  };
  const handleResetFilter = () => {
    const initial = getInitialJobFilters();
    setFilterDrafts(initial);
    setFilters(initial);
    setCurrentPage(1);
    setSortBy("createDate");
    setSortOrder("DESC");
  };

  const handleSortChange = (val: string) => {
    if (val === "earliest") {
      setSortBy("createDate");
      setSortOrder("DESC");
    } else if (val === "oldest") {
      setSortBy("createDate");
      setSortOrder("ASC");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full min-h-[500px] text-red-500">
        An error occurred: {error}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-4 mt-2">
      <div className="w-full px-6 py-8 bg-white border border-gray-100 shadow-sm rounded-lg md:px-10 md:py-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              Architect Your{" "}
              <span className="text-blue-500">Next Career Move.</span>
            </h1>
            {isAtLeastAdmin && (
              <Link href="/career/add-job">
                <Button
                  type="primary"
                  shape="round"
                  size="middle"
                  className="font-medium"
                >
                  + Post a Job
                </Button>
              </Link>
            )}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
            A curated workspace for the world&apos;s most ambitious digital
            builders, engineers, and designers.
          </p>
        </div>

        {/* Top Search Bar */}
        <div className="flex flex-col gap-3 p-3 mb-8 bg-white border border-gray-100 shadow-sm md:flex-row md:items-center rounded-lg">
          <div className="flex items-center flex-1 h-[40px] bg-gray-50 rounded-lg px-2 transition-colors hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
            <SearchOutlined className="px-2 text-gray-400" />
            <Select
              showSearch
              placeholder="Select Job Title"
              variant="borderless"
              className="w-full text-sm font-medium"
              allowClear
              value={filterDrafts.jobTitleName || undefined}
              onChange={(value) =>
                setFilterDrafts({ ...filterDrafts, jobTitleName: value })
              }
            >
              {jobTitles.map((job) => (
                <Option key={job.id} value={job.name}>
                  {job.name}
                </Option>
              ))}
            </Select>
          </div>
          <Input
            prefix={<EnvironmentOutlined className="text-gray-400" />}
            placeholder="Location (Da Nang, SF)"
            className="flex-1 py-2 text-sm border-none bg-gray-50 rounded-lg hover:bg-gray-100 focus:bg-white"
            value={filterDrafts.location}
            allowClear
            onChange={(e) =>
              setFilterDrafts({ ...filterDrafts, location: e.target.value })
            }
            onPressEnter={handleApplyFilter}
          />
          <div className="flex items-center w-full md:w-60 h-[40px] bg-gray-50 rounded-lg px-2 transition-colors hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
            <Select
              placeholder="Employment Type"
              defaultValue="FULL_TIME"
              variant="borderless"
              className="w-full text-sm font-medium"
              allowClear
              value={filterDrafts.employmentType}
              onChange={(value) =>
                setFilterDrafts({ ...filterDrafts, employmentType: value })
              }
            >
              <Option value="FULL_TIME">Full-time</Option>
              <Option value="PART_TIME">Part-time</Option>
              <Option value="REMOTE">Remote</Option>
            </Select>
          </div>
          <Button
            type="default"
            shape="round"
            size="middle"
            onClick={handleResetFilter}
          >
            Reset
          </Button>
          <Button
            type="primary"
            shape="round"
            size="middle"
            onClick={() => {
              handleApplyFilter();
              setCurrentPage(1);
            }}
          >
            + Apply
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
                value={
                  filterDrafts.level
                    ? filterDrafts.level
                        .split(",")
                        .map((l) => l.trim())
                        .filter(Boolean)
                    : []
                }
                onChange={(checkedValues) => {
                  setFilterDrafts({
                    ...filterDrafts,
                    level: checkedValues.join(", "),
                  });
                }}
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
                {total} Available Opportunities
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <Select
                  defaultValue="earliest"
                  variant="borderless"
                  className="font-sans font-semibold text-blue-600"
                  onChange={handleSortChange}
                >
                  <Option value="earliest">Earliest</Option>
                  <Option value="oldest">Oldest</Option>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 shadow-sm rounded-lg">
                <Spin size="large" />
              </div>
            ) : safeJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 shadow-sm rounded-lg">
                <Empty
                  description={
                    <span className="text-gray-500">
                      No open positions currently available.
                    </span>
                  }
                />
              </div>
            ) : (
              safeJobs.map((job) => {
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
                    className="flex flex-col gap-4 p-5 transition-all duration-200 bg-white border border-gray-100 shadow-sm md:flex-row md:items-center rounded-lg hover:shadow-md group"
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
                        <span className="px-3 py-1 text-xs font-semibold text-blue-700 rounded-lg bg-blue-50">
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
                          className="h-9 px-6 font-semibold shadow-sm rounded-lg"
                        >
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination */}
            {!loading && total > 0 && (
              <div className="flex justify-end mt-4">
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
        </div>
      </div>
    </div>
  );
}
