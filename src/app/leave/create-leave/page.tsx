"use client";

import { Button, DatePicker, Select } from "antd";

const { Option } = Select;

export default function CreateNewRequestPage() {
  return (
    <div className="flex-1 w-full p-4 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="text-xl font-semibold">Create New Request</h2>
        <a className="inline-block mb-2 text-sm text-blue-600 cursor-pointer hover:underline">
          Time Off (Leave) Requests and Balances
        </a>
        {/* <hr className="h-px mx-auto mb-2 bg-gray-300 border-0 rounded w-2xl md:mb-3 dark:bg-gray-600"></hr> */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <div className="flex items-center gap-2 mb-4">
            <label className="w-24 text-sm font-medium">Request Type*:</label>
            <Select defaultValue="--Select--" className="flex-1 max-w-lg">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">My Abnormal Case</Option>
              <Option value="Approved">My Late Coming</Option>
            </Select>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="w-16 text-sm font-medium whitespace-nowrap">
              Duration:
            </label>
            <input
              className="flex-1 max-w-xl px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Type for hints..."
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium w-18">From Date:</label>
            <DatePicker className="flex-1 max-w-lg" placeholder="Select date" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium w-18">Approver*:</label>
            <Select defaultValue="--Select--" className="w-full max-w-lg">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Leader</Option>
              <Option value="Approved">Project Manager</Option>
            </Select>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium w-14">To Date:</label>
            <DatePicker className="flex-1 max-w-xl" placeholder="Select date" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium w-30">
              Excepted Approve:
            </label>
            <DatePicker className="flex-1 max-w-lg" placeholder="Select date" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium w-22">Partial Days*:</label>
            <Select defaultValue="--Select--" className="flex-1 max-w-lg">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Full Day</Option>
              <Option value="Approved">Half Day</Option>
            </Select>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="w-20 text-sm font-medium">Supervisor*:</label>
            <Select defaultValue="--Select--" className="flex-1 max-w-lg">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">UserA</Option>
              <Option value="Approved">UserB</Option>
            </Select>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium w-14">Reason*:</label>
            <Select defaultValue="--Select--" className="flex-1 max-w-xl">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Nghỉ Phép</Option>
              <Option value="Approved">Others.</Option>
            </Select>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium w-18">Inform To:</label>
            <Select defaultValue="--Select--" className="flex-1 max-w-lg">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">UserA</Option>
              <Option value="Approved">UserB</Option>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Reason Details:
            </label>
            <textarea
              id="message"
              rows={4}
              className="block w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Write your reason details here..."
            ></textarea>
          </div>
        </div>
        <div className="grid justify-end grid-flow-col gap-2 mt-4">
          <Button
            type="primary"
            shape="round"
            size="large"
            ghost
            className="text-blue-500"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            + Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
