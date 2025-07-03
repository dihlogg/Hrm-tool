"use client";

import { Button, DatePicker, Select } from "antd";

const { Option } = Select;

export default function CreateNewRequestPage() {
  return (
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="mb-4 text-xl font-semibold md:text-2xl">Create New Request</h2>
        <a className="inline-block mb-4 text-sm text-blue-600 hover:underline">
          Time Off (Leave) Requests and Balances
        </a>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Request Type */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              Request Type*:
            </label>
            <Select
              defaultValue="--Select--"
              className="w-full sm:flex-1"
              size="large"
            >
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">My Abnormal Case</Option>
              <Option value="Approved">My Late Coming</Option>
            </Select>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              Duration:
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded sm:flex-1 focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Type for hints..."
            />
          </div>

          {/* From Date */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              From Date:
            </label>
            <DatePicker
              className="w-full sm:flex-1"
              placeholder="Select date"
              size="large"
            />
          </div>

          {/* Approver */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              Approver*:
            </label>
            <Select
              defaultValue="--Select--"
              className="w-full sm:flex-1"
              size="large"
            >
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Leader</Option>
              <Option value="Approved">Project Manager</Option>
            </Select>
          </div>

          {/* To Date */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              To Date:
            </label>
            <DatePicker
              className="w-full sm:flex-1"
              placeholder="Select date"
              size="large"
            />
          </div>

          {/* Expected Approve */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              Excepted Approve:
            </label>
            <DatePicker
              className="w-full sm:flex-1"
              placeholder="Select date"
              size="large"
            />
          </div>

          {/* Partial Days */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              Partial Days*:
            </label>
            <Select
              defaultValue="--Select--"
              className="w-full sm:flex-1"
              size="large"
            >
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Full Day</Option>
              <Option value="Approved">Half Day</Option>
            </Select>
          </div>

          {/* Supervisor */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              Supervisor*:
            </label>
            <Select
              defaultValue="--Select--"
              className="w-full sm:flex-1"
              size="large"
            >
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">UserA</Option>
              <Option value="Approved">UserB</Option>
            </Select>
          </div>

          {/* Reason */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              Reason*:
            </label>
            <Select
              defaultValue="--Select--"
              className="w-full sm:flex-1"
              size="large"
            >
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Nghỉ Phép</Option>
              <Option value="Approved">Others.</Option>
            </Select>
          </div>

          {/* Inform To */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm font-medium sm:w-24 shrink-0">
              Inform To:
            </label>
            <Select
              defaultValue="--Select--"
              className="w-full sm:flex-1"
              size="large"
            >
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">UserA</Option>
              <Option value="Approved">UserB</Option>
            </Select>
          </div>

          {/* Reason Details */}
          <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-medium">
              Reason Details:
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Write your reason details here..."
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="primary"
            shape="round"
            size="middle"
            ghost
            className="text-blue-500 border-blue-500 hover:bg-blue-50"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            shape="round"
            size="middle"
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            + Apply
          </Button>
        </div>
      </div>
    </div>
  );
}