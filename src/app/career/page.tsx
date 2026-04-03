"use client";

import React from "react";
import Link from "next/link";
import { Spin, Empty, Button } from "antd";
import { useGetAllJobs } from "@/hooks/ats/jobs/useGetAllJobs";
import JobCard from "@/components/career/jobs/JobCard";

export default function JobListPage() {
  const { jobs, loading, error } = useGetAllJobs();

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
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between rounded-lg">
        <h2 className="text-xl font-semibold text-gray-500 border-b-gray-400">
          Job Opportunities
        </h2>
        <Link href="/career/add-job">
          <Button
            type="primary"
            shape="round"
            size="large"
            className="!mb-1 text-white bg-blue-500 hover:bg-blue-600"
          >
            + Add Job
          </Button>
        </Link>
      </div>

      {/* Jobs List */}
      <div className="flex flex-col gap-4">
        {jobs.length === 0 ? (
          <div className="p-6 py-20 bg-white border border-gray-200 shadow-sm rounded-xl">
            <Empty
              description={
                <span className="text-gray-500">
                  No open positions currently available.
                </span>
              }
            />
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}
