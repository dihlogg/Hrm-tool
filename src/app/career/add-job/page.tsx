"use client";

import React, { useState } from "react";
import { Button, message, notification, Select, DatePicker } from "antd";
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
import Title from "antd/es/skeleton/Title";

const { Option } = Select;

export default function AddJobPage() {
  const router = useRouter();
  const { createJob } = useCreateJob();
  const { employee } = useAuthContext();
  const { jobTitles } = useJobTitles();
  const { subUnits } = useSubUnits();
  const [api, contextHolder] = notification.useNotification();

  const [formErrors, setFormErrors] = useState<{
    title?: string;
    employmentType?: string;
    status?: string;
    jobTitleId?: string;
    subUnitId?: string;
  }>({});

  const [title, setTitle] = useState("");
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

  const resetForm = () => {
    setTitle("");
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
    setFormErrors({});
  };

  const handleSubmit = async () => {
    const errors: typeof formErrors = {};

    if (!title.trim()) errors.title = "*Required";
    if (!employmentType) errors.employmentType = "*Required";
    if (!status) errors.status = "*Required";
    if (!jobTitleId) errors.jobTitleId = "*Required";
    if (!subUnitId) errors.subUnitId = "*Required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.warning("Please fill in all required fields before submitting!");
      return;
    }

    try {
      const payload: CreateJobDto = {
        employeeId: employee?.id,
        jobTitleId,
        jobTitleName,
        subUnitId,
        subUnitName,
        title,
        employmentType,
        location,
        fromDate: fromDate ? fromDate.toISOString() : null,
        toDate: toDate ? toDate.toISOString() : null,
        status,
        description,
        responsibilities,
        requirements,
        benefits,
      };

      await createJob(payload);
      api.success({
        message: "Job created successfully!",
        description: `Position ${title} has been added by ${employee?.firstName} ${employee?.lastName}.`,
        placement: "bottomLeft",
      });
      resetForm();

      router.push("/career");
    } catch (err: unknown) {
      let msg = "An unknown error occurred.";
      if (err instanceof Error) msg = err.message;
      api.error({
        message: "Job created failed!",
        description: msg,
        placement: "bottomLeft",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        <div className="flex-col px-8 py-6 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
          <div className="flex items-center justify-between pb-2 mb-6 border-b border-gray-400">
            <h2 className="text-xl font-semibold text-gray-500">
              Add New Job Opportunity
            </h2>
            <Button
              type="primary"
              shape="round"
              ghost
              onClick={() => router.push("/career")}
            >
              Back to List
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            {/* General Info Section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-start">
                <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                  Job Title*
                </label>
                <Select
                  className="w-full"
                  placeholder="--Select--"
                  allowClear
                  value={jobTitleId}
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
                {formErrors.jobTitleId && (
                  <span className="!mt-1 text-sm font-medium text-red-500">
                    {formErrors.jobTitleId}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start">
                <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                  Sub Unit*
                </label>
                <Select
                  className="w-full"
                  placeholder="--Select--"
                  allowClear
                  value={subUnitId}
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
                {formErrors.subUnitId && (
                  <span className="!mt-1 text-sm font-medium text-red-500">
                    {formErrors.subUnitId}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start">
                <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                  Title
                </label>
                <input
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  placeholder="Welcome to become an employee at LTD!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col items-start">
                <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                  Location
                </label>
                <input
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  placeholder="Da Nang City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="flex flex-col items-start">
                <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                  From Date
                </label>
                <DatePicker
                  format={(value) =>
                    value ? value.format("DD-MMM-YYYY").toUpperCase() : ""
                  }
                  className="w-full rounded-md"
                  placeholder="Select Start Date"
                  value={fromDate}
                  onChange={(date) => setFromDate(date)}
                />
              </div>

              <div className="flex flex-col items-start">
                <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                  To Date
                </label>
                <DatePicker
                  format={(value) =>
                    value ? value.format("DD-MMM-YYYY").toUpperCase() : ""
                  }
                  className="w-full rounded-md"
                  placeholder="Select End Date"
                  value={toDate}
                  disabledDate={(current) =>
                    fromDate ? current.isBefore(fromDate, "day") : false
                  }
                  onChange={(date) => setToDate(date)}
                />
              </div>

              <div className="flex flex-col items-start">
                <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                  Employment Type*
                </label>
                <Select
                  className="w-full"
                  placeholder="--Select--"
                  allowClear
                  value={employmentType}
                  onChange={(value) => {
                    setEmploymentType(value);
                    setFormErrors((prev) => ({
                      ...prev,
                      employmentType: undefined,
                    }));
                  }}
                >
                  <Option value={EmploymentType.FULL_TIME}>Full Time</Option>
                  <Option value={EmploymentType.PART_TIME}>Part Time</Option>
                  <Option value={EmploymentType.REMOTE}>Remote</Option>
                </Select>
                {formErrors.employmentType && (
                  <span className="!mt-1 text-sm font-medium text-red-500">
                    {formErrors.employmentType}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start">
                <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                  Status*
                </label>
                <Select
                  className="w-full"
                  placeholder="--Select--"
                  allowClear
                  value={status}
                  onChange={(value) => {
                    setStatus(value);
                    setFormErrors((prev) => ({ ...prev, status: undefined }));
                  }}
                >
                  <Option value={JobStatus.OPEN}>Open</Option>
                  <Option value={JobStatus.CLOSED}>Closed</Option>
                </Select>
                {formErrors.status && (
                  <span className="!mt-1 text-sm font-medium text-red-500">
                    {formErrors.status}
                  </span>
                )}
              </div>
            </div>

            {/* Detail Section - Multi-line Textareas */}
            <div className="pt-4 mt-2 border-t border-gray-100">
              <h3 className="mb-4 text-xl font-semibold text-gray-600">
                Job Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="w-full">
                  <label className="flex w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="General description about the job..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="w-full">
                  <label className="flex w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                    Responsibilities
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-3 py-2 text-sm leading-relaxed text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="1. Build and maintain features...&#10;2. Collaborate with team..."
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                  ></textarea>
                </div>

                <div className="w-full">
                  <label className="flex w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                    Requirements
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-3 py-2 text-sm leading-relaxed text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="1. 3+ years of experience with React...&#10;2. English proficiency..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  ></textarea>
                </div>

                <div className="w-full">
                  <label className="flex w-full pb-1 mb-1 text-sm font-medium text-gray-500">
                    Benefits
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-3 py-2 text-sm leading-relaxed text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="1. Health insurance...&#10;2. 13th month salary..."
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Actions */}
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
                  onClick={() => router.push("/career")}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  size="middle"
                  className="text-white bg-blue-500 hover:bg-blue-600"
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
