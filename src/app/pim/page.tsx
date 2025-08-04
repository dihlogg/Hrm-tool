"use client";

import { useJobTitles } from "@/hooks/job-titles/useJobTitles";
import { useSubUnits } from "@/hooks/sub-units/useSubUnits";
import { useUserStatuses } from "@/hooks/user-statuses/useUserStatuses";
import { Button, Pagination, Select, Table } from "antd";
import { useState } from "react";
import {
  EditOutlined,
  IssuesCloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { CreateEmployeeDto } from "@/hooks/employees/CreateEmployeeDto";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { useEmployees } from "@/hooks/employees/useEmployees";

const { Option } = Select;

export default function EmployeeListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);
  const { jobTitles, error: jobTitleError } = useJobTitles();
  const { subUnits, error: subUnitError } = useSubUnits();
  const { userStatuses, error: userStatusError } = useUserStatuses();
  const { employees, total, loading, error } = useEmployees(
    currentPage,
    pageSize,
    sortBy,
    sortOrder ? antdSortOrderToApiOrder(sortOrder) : undefined
  );

  const router = useRouter();

  function antdSortOrderToApiOrder(
    order: SortOrder | undefined
  ): "ASC" | "DESC" | undefined {
    if (order === "ascend") return "ASC";
    if (order === "descend") return "DESC";
    return undefined;
  }

  const jobTitleMap = Object.fromEntries(
    jobTitles.map((job) => [job.id, job.name])
  );

  const subUnitMap = Object.fromEntries(
    subUnits.map((sub) => [sub.id, sub.name])
  );

  const columns: ColumnsType<CreateEmployeeDto> = [
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: true,
      sortOrder: sortBy === "firstName" ? sortOrder : undefined,
      render: (text) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: true,
      sortOrder: sortBy === "lastName" ? sortOrder : undefined,
      render: (text) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: "Job Title",
      dataIndex: "jobTitleId",
      sorter: true,
      sortOrder: sortBy === "jobTitleId" ? sortOrder : undefined,
      render: (id) => (
        <span className="text-sm text-gray-500">
          {jobTitleMap[id] || "Unknown"}
        </span>
      ),
    },
    {
      title: "Employee Type",
      dataIndex: "employmentType",
      sorter: true,
      sortOrder: sortBy === "employmentType" ? sortOrder : undefined,
      render: (text) => <span className="text-sm text-gray-500">{text}</span>,
    },
    {
      title: "Sub Unit",
      dataIndex: "subUnitId",
      sorter: true,
      sortOrder: sortBy === "subUnitId" ? sortOrder : undefined,
      render: (id) => (
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
          <button className="p-2 text-red-600 cursor-pointer hover:text-blue-800">
            <IssuesCloseOutlined />
          </button>
          <button className="p-2 text-red-600 cursor-pointer hover:text-blue-800">
            <EyeOutlined />
          </button>
        </div>
      ),
    },
  ];

  const handleResetSort = () => {
    setSortBy(undefined);
    setSortOrder(undefined);
    setCurrentPage(1); // Reset to first page for consistency
  };

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
              First Name
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              type="text"
              placeholder="Type for hints..."
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="w-full mb-2 text-sm text-gray-500 font-small">
              Last Name
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
            onClick={handleResetSort}
          >
            Reset
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
          <h2 className="text-xl font-semibold text-gray-500">
            ({total ?? 0}) Records Found
          </h2>
          <a className="text-sm text-blue-600 cursor-pointer hover:underline">
            Export
          </a>
        </div>
        <Table
          columns={columns}
          dataSource={employees}
          pagination={false}
          rowKey="id"
          loading={loading}
          onChange={(pagination, filters, sorter) => {
            if (!Array.isArray(sorter)) {
              const field = typeof sorter.field === "string" ? sorter.field : undefined;
              const order = sorter.order as SortOrder | undefined;

              // Only update states if there’s an actual change
              if (field !== sortBy || order !== sortOrder) {
                setSortBy(field);
                setSortOrder(order);
              }
            }
          }}
        />
        <div className="flex items-center justify-end mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}