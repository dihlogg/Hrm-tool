"use client";
import { mockMyRequests } from "@/utils/time/mock-data-emp-timesheet";
import { Button, DatePicker, Pagination, Select, Table } from "antd";
import { useState } from "react";

const { Option } = Select;

const columns = [
  { title: "Employee Name", dataIndex: "name", key: "name" },
  {
    title: "Timesheet Period",
    key: "period",
    render: (_: any, record: { startDate: string; endDate: string }) =>
      `${record.startDate} - ${record.endDate}`,
  },
];

export default function MyTimesheetPage() {
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
        <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
          Select Employee
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start">
            <label className="w-full mb-2 text-sm text-gray-500 font-small">
              Employee Name*
            </label>
            <input
              className="px-2 py-3 text-sm bg-white border border-gray-200 rounded-md w-[580px] focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Type for hints..."
            />
          </div>
        </div>
        <div className="grid justify-end grid-flow-col gap-2 mt-4">
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
      {/* Table Section */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Timesheets Pending Action</h2>
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
