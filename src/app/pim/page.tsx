"use client";

import { useJobTitles } from "@/hooks/job-titles/useJobTitles";
import { useSubUnits } from "@/hooks/sub-units/useSubUnits";
import { useUserStatuses } from "@/hooks/user-statuses/useUserStatuses";
import { Button, Pagination, Select, Table } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEmployee } from "@/hooks/employees/useGetEmployees";
import { CreateEmployeeDto } from "@/hooks/employees/CreateEmployeeDto";

const { Option } = Select;

export default function EmployeeListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { jobTitles, error: jobTitleError } = useJobTitles();
  const { subUnits, error: subUnitError } = useSubUnits();
  const { userStatuses, error: userStatusError } = useUserStatuses();
  const { employee, error: employeeError } = useEmployee();
  const pageSize = 3;
  const router = useRouter();

  const paginatedData = employee.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const jobTitleMap = Object.fromEntries(
    jobTitles.map((job) => [job.id, job.name])
  );

  const subUnitMap = Object.fromEntries(
    subUnits.map((sub) => [sub.id, sub.name])
  );

  const columns = [
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">First Name</span>
      ),
      dataIndex: "firstName",
      render: (text: string) => (
        <span className="text-sm text-gray-500">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">Last Name</span>
      ),
      dataIndex: "lastName",
      render: (text: string) => (
        <span className="text-sm text-gray-500">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">Job Title</span>
      ),
      dataIndex: "jobTitleId",
      render: (id: string) => (
        <span className="text-sm text-gray-500">
          {jobTitleMap[id] || "Unknown"}
        </span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">
          Employee Type
        </span>
      ),
      dataIndex: "employmentType",
      render: (text: string) => (
        <span className="text-sm text-gray-500">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">Sub Unit</span>
      ),
      dataIndex: "subUnitId",
      render: (id: string) => (
        <span className="text-sm text-gray-500">
          {subUnitMap[id] || "Unknown"}
        </span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">Actions</span>
      ),
      key: "actions",
      render: (_: any, record: CreateEmployeeDto) => (
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/profile?id=${record.id}`)}
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

  return (
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
          Employee Information
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start">
            <label className="w-full mb-2 text-sm text-gray-500 font-small">
              Employee Name
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              type="text"
              placeholder="Type for hints..."
            />
          </div>

          <div className="flex flex-col items-start">
            <label className="w-full mb-2 text-sm text-gray-500 font-small">
              Employee Id
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
            <Select defaultValue="--Select--" className="w-full !mt-2">
              <Option value="--Select--">--Select--</Option>

              {userStatuses.map((status) => (
                <Option key={status.id} value={status.name}>
                  {status.name}
                </Option>
              ))}
            </Select>

            {userStatusError && (
              <p className="mt-1 text-sm text-red-500">{userStatusError}</p>
            )}
          </div>
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              Include
            </label>
            <Select defaultValue="--Select--" className="w-full !mt-2">
              <Option value="--Select--">--Select--</Option>
              <Option value="current">Current Employees Only</Option>
              <Option value="past">Past Employees Only</Option>
              <Option value="current-past">
                Current and Past Employees Only
              </Option>
            </Select>
          </div>
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              Supervisor
            </label>
            <Select defaultValue="--Select--" className="w-full !mt-2">
              <Option value="--Select--">--Select--</Option>
              <Option value="supervisor-a">SupervisorA</Option>
              <Option value="supervisor-b">SupervisorB</Option>
            </Select>
          </div>
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              Job Title
            </label>
            <Select defaultValue="--Select--" className="w-full !mt-2">
              <Option value="--Select--">--Select--</Option>

              {jobTitles.map((job) => (
                <Option key={job.id} value={job.name}>
                  {job.name}
                </Option>
              ))}
            </Select>

            {jobTitleError && (
              <p className="mt-1 text-sm text-red-500">{jobTitleError}</p>
            )}
          </div>
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              Sub Unit
            </label>
            <Select defaultValue="--Select--" className="w-full !mt-2">
              <Option value="--Select--">--Select--</Option>

              {subUnits.map((sub) => (
                <Option key={sub.id} value={sub.name}>
                  {sub.name}
                </Option>
              ))}
            </Select>

            {subUnitError && (
              <p className="mt-1 text-sm text-red-500">{subUnitError}</p>
            )}
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
          <h2 className="text-xl font-semibold text-gray-500">Employee List</h2>
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
            total={employee.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
