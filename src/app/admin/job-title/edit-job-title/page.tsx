"use client";

import React, { useEffect, useState } from "react";
import { Button, message, notification } from "antd";
import { CreateJobTitleDto } from "@/hooks/employees/job-titles/CreateJobTitleDto";
import { useUpdateJobTitle } from "@/hooks/employees/job-titles/useUpdateJobTitle";
import { useGetJobTitleById } from "@/hooks/employees/job-titles/useGetJobTitleById";
import { useSearchParams } from "next/navigation";

export default function EditJobTitlePage() {
  const { updateJobTitle } = useUpdateJobTitle();
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
  }>({});
  const [api, contextHolder] = notification.useNotification();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const searchParams = useSearchParams();
  const jobTitleId = searchParams.get("id") || undefined;
  const { jobTitles, loading } = useGetJobTitleById(jobTitleId ?? "");

  useEffect(() => {
    if (jobTitles) {
      setName(jobTitles.name ?? null);
      setDescription(jobTitles.description ?? null);
    }
  }, [jobTitles]);

  const handleSubmit = async () => {
    const errors: typeof formErrors = {};

    if (!name.trim()) errors.name = "Required";
    if (!description.trim()) errors.description = "Required";
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      message.warning("Please fill in all required fields before submitting!");
      return;
    }

    try {
      const payload: CreateJobTitleDto = {
        id: jobTitleId,
        name: name || "",
        description: description || "",
      };

      await updateJobTitle(jobTitleId!, payload);
      console.log("JobTitle updated successfully!");
      api.success({
        message: "Job Title Update Successfully!",
        description: `Job Title has been updated.`,
        placement: "bottomLeft",
        duration: 3,
        pauseOnHover: true,
      });
    } catch (err: any) {
      api.error({
        message: "Job Title Update failed!",
        description: err?.message || "An unknown error occurred.",
        placement: "bottomLeft",
        duration: 3,
        pauseOnHover: true,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
          <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-gray-400">
            Add Job Title
          </h2>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-col w-full py-4 border-gray-200 rounded-lg sm:flex-row">
              <div className="grid grid-cols-1 gap-8 mb-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Job Titles*
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormErrors((prev) => ({
                        ...prev,
                        name: undefined,
                      }));
                    }}
                  />
                  {formErrors.name && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.name}
                    </span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="flex w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Job Description*
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="Write description here..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setFormErrors((prev) => ({
                        ...prev,
                        description: undefined,
                      }));
                    }}
                  ></textarea>
                  {formErrors.description && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.description}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <span className="text-sm italic font-medium text-gray-500">
                  * Required
                </span>
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
