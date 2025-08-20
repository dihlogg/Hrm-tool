"use client";

import { useAuthContext } from "@/contexts/authContext";
import { useGetEmployeeDetailsByUserId } from "@/hooks/employees/useGetEmployeeDetailsByUserId";
import { CreateLeaveRequestDto } from "@/hooks/leave/CreateLeaveRequestDto";
import {
  getInitialFilters,
  LeaveRequestFilters,
} from "@/hooks/leave/LeaveRequestFilterDto";
import { useGetLeaveRequestByEmployeeId } from "@/hooks/leave/useGetLeaveRequestByEmployeeId";
import { mockMyRequests } from "@/utils/leave/mock-data-my-request";
import { antdSortOrderToApiOrder } from "@/utils/tableSorting";
import { Button, DatePicker, Pagination, Select, Table } from "antd";
import { ColumnsType, SortOrder } from "antd/es/table/interface";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

export default function MyRequestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [hotReload, setHotReload] = useState(0);
  const { userId } = useAuthContext();
  const { employee, loading: loadingEmployee } = useGetEmployeeDetailsByUserId(
    userId ?? ""
  );
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);

  //filter
  const [filters, setFilters] = useState<LeaveRequestFilters>(
    getInitialFilters()
  );
  const [filterDrafts, setFilterDrafts] = useState<LeaveRequestFilters>(
    getInitialFilters()
  );
  const { leaveRequests, total, loading } = useGetLeaveRequestByEmployeeId(
    employee?.id ?? "",
    currentPage,
    pageSize,
    sortBy,
    sortOrder ? antdSortOrderToApiOrder(sortOrder) : undefined,
    filters,
    hotReload
  );

  function mapSorterFieldToApiField(
    field: string | undefined
  ): string | undefined {
    if (!field) return undefined;
    switch (field) {
      case "leaveRequestTypeId":
        return "leaveRequestType";
      case "leaveStatusId":
        return "leaveStatus";
      case "leaveReasonId":
        return "leaveReason";
      default:
        return field;
    }
  }

  const columns: ColumnsType<CreateLeaveRequestDto> = [
    {
      title: <span className="select-none">Request Type</span>,
      dataIndex: "leaveRequestTypeId",
      sorter: true,
      sortOrder: sortBy === "leaveRequestType" ? sortOrder : undefined,
      render: (_, record) => record.leaveRequestType?.name || "N/A",
    },
    {
      title: <span className="select-none">From Date</span>,
      dataIndex: "fromDate",
      render: (text) => (
        <span>
          {text
            ? dayjs(text).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm")
            : "N/A"}
        </span>
      ),
    },
    {
      title: <span className="select-none">To Date</span>,
      dataIndex: "toDate",
      render: (text) => (
        <span>
          {text
            ? dayjs(text).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm")
            : "N/A"}
        </span>
      ),
    },
    {
      title: <span className="select-none">Duration (Days)</span>,
      dataIndex: "duration",
      sorter: true,
      sortOrder: sortBy === "duration" ? sortOrder : undefined,
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Reason</span>,
      dataIndex: "leaveReasonId",
      sorter: true,
      sortOrder: sortBy === "leaveReason" ? sortOrder : undefined,
      render: (_, record) => record.leaveReason?.name || "N/A",
    },
    {
      title: <span className="select-none">Approver</span>,
      dataIndex: "approverId",
      sorter: true,
      sortOrder: sortBy === "Approver" ? sortOrder : undefined,
      render: (_, record) => record.approve?.name || "N/A",
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600">Inform To</span>
      ),
      dataIndex: "InformTo",
      render: (text: string) => (
        <span className="text-sm text-gray-500 font-small">{text}</span>
      ),
    },
    {
      title: <span className="select-none">Status</span>,
      dataIndex: "leaveStatusId",
      sorter: true,
      sortOrder: sortBy === "leaveStatus" ? sortOrder : undefined,
      render: (_, record) => record.leaveStatus?.name || "N/A",
    },
  ];

  return (
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
          My Request
        </h2>
        <a className="inline-block mb-2 text-sm text-blue-600 cursor-pointer hover:underline">
          Time Off (Leave) Requests and Balances
        </a>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              From Date
            </label>
            <DatePicker className="w-full !mt-2" placeholder="Select date" />
          </div>
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              To Date
            </label>
            <DatePicker className="w-full !mt-2" placeholder="Select date" />
          </div>
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              Request Status
            </label>
            <Select defaultValue="--Select--" className="w-full !mt-2">
              <Option value="--Select--">--Select--</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
            </Select>
          </div>
          <div>
            <label className="w-full text-sm text-gray-500 font-small">
              Request Type
            </label>
            <Select defaultValue="--Select--" className="w-full !mt-2">
              <Option value="--Select--">--Select--</Option>
              <Option value="Annual">Annual</Option>
              <Option value="Sick">Sick</Option>
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
          <h2 className="text-xl font-semibold text-gray-500">My Requests</h2>
          <a className="text-sm text-blue-600 cursor-pointer hover:underline">
            View All
          </a>
        </div>
        <Table
          columns={columns}
          dataSource={leaveRequests}
          pagination={false}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
          onChange={(pagination, filters, sorter) => {
            if (!Array.isArray(sorter)) {
              const rawField =
                typeof sorter.field === "string" ? sorter.field : undefined;
              const mappedField = mapSorterFieldToApiField(rawField);
              const order = sorter.order as SortOrder | undefined;

              if (mappedField !== sortBy || order !== sortOrder) {
                setSortBy(mappedField);
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
