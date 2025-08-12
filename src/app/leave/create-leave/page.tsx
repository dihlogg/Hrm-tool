"use client";

import { Button, DatePicker, Select } from "antd";

const { Option } = Select;

export default function CreateNewRequestPage() {
  return (
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
          Create New Request
        </h2>
        <a className="inline-block mb-4 text-sm text-blue-600 hover:underline">
          Time Off (Leave) Requests and Balances
        </a>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Request Type */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              Request Type*:
            </label>
            <Select defaultValue="--Select--" className="w-full sm:flex-1">
              <Option value="--Select--">--Select--</Option>
              <Option value="Annual">My Abnormal Case</Option>
              <Option value="Sick">My Late Coming</Option>
            </Select>
          </div>

          {/* Approver */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              Approver*:
            </label>
            <Select defaultValue="--Select--" className="w-full sm:flex-1">
              <Option value="--Select--">--Select--</Option>
              <Option value="Leader">Leader</Option>
              <Option value="PM">Project Manager</Option>
            </Select>
          </div>

          {/* From Date */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              From Date:
            </label>
            <DatePicker
              showTime={{ format: "HH:mm" }}
              className="w-full sm:flex-1"
              placeholder="Select date"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              To Date:
            </label>
            <DatePicker
              showTime={{ format: "HH:mm" }}
              className="w-full sm:flex-1"
              placeholder="Select date"
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              Duration:
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              type="text"
              placeholder="Type for hints..."
            />
          </div>

          {/* Partial Days */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              Partial Days*:
            </label>
            <Select defaultValue="--Select--" className="w-full sm:flex-1">
              <Option value="--Select--">--Select--</Option>
              <Option value="FullDay">Full Day</Option>
              <Option value="HalfDay">Half Day</Option>
            </Select>
          </div>

          {/* Reason */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              Reason*:
            </label>
            <Select defaultValue="--Select--" className="w-full sm:flex-1">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Nghỉ Phép</Option>
              <Option value="Approved">Others.</Option>
            </Select>
          </div>

          {/* Inform To */}
          <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              Inform To:
            </label>
            <Select defaultValue="--Select--" className="w-full sm:flex-1">
              <Option value="--Select--">--Select--</Option>
              <Option value="UserA">UserA</Option>
              <Option value="UserB">UserB</Option>
            </Select>
          </div>

          {/* Reason Details */}
          <div className="sm:col-span-2">
            <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
              Reason Details:
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-3 py-2 !mt-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Write your reason details here..."
            ></textarea>
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
    </div>
  );
}
