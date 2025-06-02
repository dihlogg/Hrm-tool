"use client";

import { mockMyRequests } from "@/utils/leave/mock-data-receive-request";
import { Button, DatePicker, Pagination, Select, Table } from "antd";
import { useState } from "react";

const { Option } = Select;

const columns = [
  { title: "Requester", dataIndex: "Requester", key: "Requester" },
  { title: "Request Type", dataIndex: "RequestType", key: "RequestType" },
  { title: "Time Request", dataIndex: "TimeRequest", key: "TimeRequest" },
  { title: "Partial Days", dataIndex: "PartialDays", key: "PartialDays" },
  { title: "Duration (Days)", dataIndex: "DurationDays", key: "DurationDays" },
  { title: "Status", dataIndex: "Status", key: "Status" },
  { title: "Delegate By", dataIndex: "DelegateBy", key: "DelegateBy" },
  { title: "Delegate To", dataIndex: "DelegateTo", key: "DelegateTo" },
];

export default function ReceiveRequestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const paginatedData = mockMyRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex-1 w-full p-4 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="text-xl font-semibold">Receive Request List</h2>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block mb-1 text-sm font-medium">From Date</label>
            <DatePicker className="w-full" placeholder="Select date" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">To Date</label>
            <DatePicker className="w-full" placeholder="Select date" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Request Status
            </label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Request Type
            </label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="Annual">Annual</Option>
              <Option value="Sick">Sick</Option>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Requester</label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="Annual">RequesterA</Option>
              <Option value="Sick">RequesterB</Option>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Supervisor</label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="Annual">SupervisorA</Option>
              <Option value="Sick">SupervisorB</Option>
            </Select>
          </div>
        </div>
        <div className="grid justify-end grid-flow-col gap-2 mt-4">
          <Button
            type="primary"
            shape="round"
            size="middle"
            ghost
            className="text-blue-500"
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
      {/* Table Section */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Requests</h2>
          <a className="text-sm text-blue-600 cursor-pointer hover:underline">
            View All
          </a>
        </div>
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
        <div className="flex items-center justify-end mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={mockMyRequests.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
