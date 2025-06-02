"use client";

import { mockMyRequests } from "@/utils/pim/mock-data-employee-list";
import { Button, DatePicker, Pagination, Select, Table } from "antd";
import { useState } from "react";

const { Option } = Select;

const columns = [
  { title: "First Name", dataIndex: "FirstName", key: "FirstName" },
  { title: "Last Name", dataIndex: "LastName", key: "LastName" },
  { title: "Job Title", dataIndex: "JobTitle", key: "JobTitle" },
  {
    title: "Employee Status",
    dataIndex: "EmployeeStatus",
    key: "EmployeeStatus",
  },
  { title: "Sub Unit", dataIndex: "SubUnit", key: "SubUnit" },
  { title: "Supervisor", dataIndex: "Supervisor", key: "Supervisor" },
];

export default function EmployeeListPage() {
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
        <h2 className="text-xl font-semibold">Employee List</h2>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start">
            <label className="w-full mb-1 text-sm font-medium">
              Employee Name
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Type for hints..."
            />
          </div>

          <div className="flex flex-col items-start">
            <label className="w-full mb-1 text-sm font-medium">
              Employee Id
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Type for hints..."
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="full-time">Full Time</Option>
              <Option value="part-time">Part Time</Option>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Include</label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="current">Current Employees Only</Option>
              <Option value="past">Past Employees Only</Option>
              <Option value="current-past">
                Current and Past Employees Only
              </Option>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Supervisor</label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="supervisor-a">SupervisorA</Option>
              <Option value="supervisor-b">SupervisorB</Option>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Job Title</label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="tester">Tester</Option>
              <Option value="development">DEV</Option>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Sub Unit</label>
            <Select defaultValue="--Select--" className="w-full">
              <Option value="--Select--">--Select--</Option>
              <Option value="sub-unit-a">Sub Unit A</Option>
              <Option value="sub-unit-b">Sub Unit B</Option>
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
          <h2 className="text-xl font-semibold">Employee List</h2>
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
