"use client";

import { mockMyRequests } from "@/utils/admin/mock-data-admin-page";
import { Button, Pagination, Select, Table } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { CreateJobTitleDto } from "@/hooks/employees/job-titles/CreateJobTitleDto";
import { useDeleteJobTitleById } from "@/hooks/employees/job-titles/useDeleteJobTitleById";

const { Option } = Select;

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const router = useRouter();

  const columns = [
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">User Name</span>
      ),
      dataIndex: "Username",
      render: (text: string) => (
        <span className="text-sm text-gray-500 font-small">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">User Role</span>
      ),
      dataIndex: "UserRole",
      render: (text: string) => (
        <span className="text-sm text-gray-500 font-small">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">
          Employee Name
        </span>
      ),
      dataIndex: "EmployeeName",
      render: (text: string) => (
        <span className="text-sm text-gray-500 font-small">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">
          Employee Status
        </span>
      ),
      dataIndex: "Status",
      render: (text: string) => (
        <span className="text-sm text-gray-500 font-small">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">Actions</span>
      ),
      key: "actions",
      render: () => (
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/admin/edit-user")}
            className="p-2 text-blue-600 cursor-pointer hover:text-blue-800"
          >
            <EditOutlined />
          </button>
          <button className="p-2 text-red-600 cursor-pointer hover:text-red-800">
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  const paginatedData = mockMyRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
          System Users
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start">
            <label className="w-full mb-1 text-sm text-gray-500 font-small">
              Username
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              type="text"
              placeholder="Type for hints..."
            />
          </div>

          <div className="flex flex-col items-start">
            <label className="w-full mb-1 text-sm text-gray-500 font-small">
              Employee Name
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              type="text"
              placeholder="Type for hints..."
            />
          </div>
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              Status
            </label>
            <Select
              defaultValue="--Select--"
              className="w-full !mt-1 custom-ant-select"
            >
              <Option value="--Select--">--Select--</Option>
              <Option value="full-time">Enabled</Option>
              <Option value="part-time">Disabled</Option>
            </Select>
          </div>
          <div>
            <label className="w-full mb-2 text-sm text-gray-500 font-small">
              User Role
            </label>
            <Select defaultValue="--Select--" className="w-full !mt-1">
              <Option value="--Select--">--Select--</Option>
              <Option value="current">Admin</Option>
              <Option value="past">ESS</Option>
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
          <h2 className="text-xl font-semibold text-gray-500">Users List</h2>
          <a className="text-sm text-blue-600 cursor-pointer hover:underline">
            View All
          </a>
        </div>
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey="Id"
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
