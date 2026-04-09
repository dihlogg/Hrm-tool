"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Upload, message, Spin } from "antd";
import {
  FileTextOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useGetJobById } from "@/hooks/ats/jobs/useGetJobById";
import { EmploymentType } from "@/hooks/ats/jobs/JobDto";
import { useApplyJob } from "@/hooks/ats/jobs/useApplyJob";

const { TextArea } = Input;
const { Dragger } = Upload;

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { job, loading: loadingJob, error: jobError } = useGetJobById(id);
  const { applyForJob, loading: isSubmitting } = useApplyJob();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedIn: "",
    coverLetter: "",
  });

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

  const formatEmpType = (type?: EmploymentType) => {
    if (type === EmploymentType.FULL_TIME) return "Full-time, Permanent";
    if (type === EmploymentType.PART_TIME) return "Part-time";
    if (type === EmploymentType.REMOTE) return "Remote";
    return "Full-time";
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      message.warning("Please fill in all required fields!");
      return;
    }

    if (!selectedFile) {
      message.warning("Please upload your CV/Resume!");
      return;
    }

    try {
      await applyForJob(selectedFile, {
        jobId: job.id,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        profileUrl: formData.linkedIn,
        coverLetter: formData.coverLetter,
      });
      message.success("Application submitted successfully!");
      router.push("/career");
    } catch (error: any) {
      message.error(error.message || "Something went wrong while applying!");
    }
  };

  return (
    <div className="relative flex-1 w-full p-4 mt-2">
      <div className="w-full px-6 py-8 bg-white border border-gray-100 shadow-sm rounded-2xl md:px-10 md:py-10">
        {/* Header Section */}
        <div className="mb-4">
          <button
            onClick={() => router.push(`/career/${job.id}`)}
            className="inline-flex !pb-2 items-center gap-2 text-sm font-medium text-gray-500 transition-colors bg-transparent border-none cursor-pointer hover:text-orange-500"
          >
            <ArrowLeftOutlined className="text-xs" />
            <span className="text-xs font-bold tracking-wider uppercase">
              Back to Job Details
            </span>
          </button>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
            Apply for {job.jobTitleName || job.title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
            Join our innovative engineering team and shape the future of digital
            infrastructure.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Application Form */}
          <div className="space-y-6 lg:col-span-8">
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <form className="space-y-6">
                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="px-1 text-sm font-semibold text-gray-600">
                      Full Name *
                    </label>
                    <Input
                      size="large"
                      className="!h-11 !px-4 !text-[15px] bg-white border-gray-200 rounded-xl hover:border-orange-400 focus:border-orange-500"
                      placeholder="Type for hints..."
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="px-1 text-sm font-semibold text-gray-600">
                      Email Address *
                    </label>
                    <Input
                      size="large"
                      className="!h-11 !px-4 !text-[15px] bg-white border-gray-200 rounded-xl hover:border-orange-400 focus:border-orange-500"
                      placeholder="Type for hints..."
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="px-1 text-sm font-semibold text-gray-600">
                      Phone Number *
                    </label>
                    <Input
                      size="large"
                      className="!h-11 !px-4 !text-[15px] bg-white border-gray-200 rounded-xl hover:border-orange-400 focus:border-orange-500"
                      placeholder="Type for hints..."
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="px-1 text-sm font-semibold text-gray-600">
                      LinkedIn / Portfolio URL{" "}
                      <span className="text-xs font-normal opacity-60">
                        (Optional)
                      </span>
                    </label>
                    <Input
                      size="large"
                      className="!h-11 !px-4 !text-[15px] bg-white border-gray-200 rounded-xl hover:border-orange-400 focus:border-orange-500"
                      placeholder="Type for hints..."
                      type="url"
                      value={formData.linkedIn}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedIn: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Cover Letter & CV Upload Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Cover Letter */}
                  <div className="flex flex-col space-y-1.5 h-full">
                    <label className="px-1 text-sm font-semibold text-gray-600">
                      Cover Letter
                    </label>
                    <TextArea
                      className="flex-1 w-full !px-4 !py-3 !text-[15px] bg-white border-gray-200 rounded-xl resize-none hover:border-orange-400 focus:border-orange-500"
                      placeholder="Tell us why you're a great fit for this role..."
                      rows={8}
                      value={formData.coverLetter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coverLetter: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* CV Upload */}
                  <div className="flex flex-col space-y-1.5 h-full">
                    <label className="px-1 text-sm font-semibold text-gray-600">
                      CV / Resume Upload *
                    </label>
                    <Dragger
                      name="file"
                      multiple={false}
                      beforeUpload={(file) => {
                        const isValidFormat =
                          file.type === "application/pdf" ||
                          file.type ===
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                        if (!isValidFormat) {
                          message.error(
                            "You can only upload PDF or DOCX files!",
                          );
                          return Upload.LIST_IGNORE;
                        }
                        setSelectedFile(file);
                        return false;
                      }}
                      onRemove={() => setSelectedFile(null)}
                      fileList={selectedFile ? [selectedFile as any] : []}
                      className="flex-1 !bg-gray-50 !p-4 rounded-xl transition-colors hover:!border-orange-400 [&_.ant-upload-drag-container]:!text-center"
                    >
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="flex items-center justify-center mb-3 bg-orange-100 rounded-full w-14 h-14">
                          <FileTextOutlined className="text-2xl text-orange-600" />
                        </div>
                        <h3 className="mb-1 text-base font-bold text-gray-900">
                          Upload your professional CV
                        </h3>
                        <p className="mb-4 text-xs text-gray-500">
                          Drag and drop your file here, or click to browse
                        </p>
                        <Button
                          type="primary"
                          shape="round"
                          size="middle"
                          className="px-8 font-bold text-white !bg-orange-400 border-none shadow-md hover:!bg-orange-500 pointer-events-none"
                        >
                          Select CV
                        </Button>
                        <p className="!mt-3 text-[11px] text-gray-400">
                          Accepted formats: PDF, DOCX.
                        </p>
                      </div>
                    </Dragger>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid justify-end grid-flow-col gap-2 mt-4">
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    className="!bg-orange-500 hover:!bg-orange-600 !text-white !border-none"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    + Apply
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Job Summary */}
          <aside className="sticky self-start space-y-6 lg:col-span-4 top-20">
            {/* Summary Card */}
            <div className="px-6 py-4 bg-gray-50 rounded-xl">
              <h2 className="flex items-center gap-2 !mb-3 text-lg font-bold text-gray-900">
                <InfoCircleOutlined className="text-orange-500" />
                Job Summary
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ClockCircleOutlined className="text-base text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                      Job Type
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatEmpType(job.employmentType)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <EnvironmentOutlined className="text-base text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {job.location || "Da Nang (Remote Friendly)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <RiseOutlined className="text-base text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                      Experience Level
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {job.level || "Senior (5+ Years)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <DollarOutlined className="text-base text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                      Salary Range
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Competitive / Negotiable
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {job.subUnitName || "CloudScale Systems"}
                    </h4>
                  </div>
                </div>
                <p className="text-xs italic leading-relaxed text-gray-500">
                  "We build the tools that empower the next generation of web
                  developers worldwide."
                </p>
              </div>
            </div>

            {/* Tip Card */}
            <div className="p-5 border border-orange-100 bg-orange-50 rounded-xl">
              <h3 className="flex items-center gap-2 mb-2 text-sm font-bold text-orange-800">
                <BulbOutlined className="text-base text-orange-600" />
                Pro Tip
              </h3>
              <p className="text-xs leading-relaxed text-orange-800/80">
                Candidates who include a customized cover letter are{" "}
                <span className="font-bold">40% more likely</span> to get an
                interview. Mention your specific experience relative to this
                role.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
