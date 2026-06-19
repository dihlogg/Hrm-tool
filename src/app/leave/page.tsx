"use client";

import { Pagination, Table, Card } from "antd";
import { useState } from "react";
import {
  OrderedListOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "@/contexts/authContext";
import { useGetEmployeeDetailsByUserId } from "@/hooks/employees/useGetEmployeeDetailsByUserId";
import { useGetMyPendingRequests } from "@/hooks/leave/useGetMyPendingRequests";
import { useGetLeaveRequestForSupervisor } from "@/hooks/leave/useGetLeaveRequestForSupervisor";
import { useGetLeaveRequestForDirector } from "@/hooks/leave/useGetLeaveRequestForDirector";
import { useGetLeaveBalanceByEmployeeId } from "@/hooks/leave/useGetLeaveBalanceByEmployeeId";
import { useGetLeaveRequestByEmployeeId } from "@/hooks/leave/useGetLeaveRequestByEmployeeId";
import { useGetLeaveRequestType } from "@/hooks/leave/leave-request-types/useGetLeaveRequestTypes";
import { useGetLeaveStatus } from "@/hooks/leave/leave-statuses/useGetLeaveStatus";
import dayjs from "dayjs";
import { LeaveRequestDto } from "@/hooks/leave/LeaveRequestDto";

const columns = [
  {
    title: <span className="text-sm font-semibold text-gray-600">Request Type</span>,
    dataIndex: "leaveRequestTypeId",
    render: (_: unknown, record: LeaveRequestDto) => (
      <span className="text-sm text-gray-500">{record.leaveRequestType?.name || "N/A"}</span>
    ),
  },
  {
    title: <span className="text-sm font-semibold text-gray-600">From Date</span>,
    dataIndex: "fromDate",
    render: (text: string) => (
      <span className="text-sm text-gray-500">{text ? dayjs(text).format("DD-MMM-YYYY") : "N/A"}</span>
    ),
  },
  {
    title: <span className="text-sm font-semibold text-gray-600">To Date</span>,
    dataIndex: "toDate",
    render: (text: string) => (
      <span className="text-sm text-gray-500">{text ? dayjs(text).format("DD-MMM-YYYY") : "N/A"}</span>
    ),
  },
  {
    title: <span className="text-sm font-semibold text-gray-600">Duration (Days)</span>,
    dataIndex: "duration",
    render: (text: number) => (
      <span className="text-sm text-gray-500">{text}</span>
    ),
  },
  {
    title: <span className="text-sm font-semibold text-gray-600">Reason</span>,
    dataIndex: "leaveReasonId",
    render: (_: unknown, record: LeaveRequestDto) => (
      <span className="text-sm text-gray-500">{record.leaveReason?.name || "N/A"}</span>
    ),
  },
  {
    title: <span className="text-sm font-semibold text-gray-600">Status</span>,
    dataIndex: "leaveStatusId",
    render: (_: unknown, record: LeaveRequestDto) => (
      <span className="text-sm text-gray-500">{record.leaveStatus?.name || "N/A"}</span>
    ),
  },
];

export default function LeavePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const pageSize = 5;

  const { userId, userRoles } = useAuthContext();
  const { employee } = useGetEmployeeDetailsByUserId(userId ?? "");
  const { total: pendingTotal, leaveRequests: pendingRequests, loading: pendingLoading } = useGetMyPendingRequests(employee?.id ?? "", activeTab === 2 ? currentPage : 1, pageSize);
  
  const isDirectorOrCeo = Array.isArray(userRoles) && (userRoles.includes("Director") || userRoles.includes("CEO"));
  const receiveDataHook = isDirectorOrCeo ? useGetLeaveRequestForDirector : useGetLeaveRequestForSupervisor;

  const { total: receiveTotal, leaveRequests: receiveRequests, loading: receiveLoading } = receiveDataHook(
    employee?.id ?? "",
    activeTab === 3 ? currentPage : 1,
    pageSize,
    undefined,
    undefined,
    {},
    0
  );

  const { leaveBalance } = useGetLeaveBalanceByEmployeeId(employee?.id ?? "");
  const annualLeave = leaveBalance?.find(b => b.leaveRequestTypeName?.toLowerCase().includes("phép năm") || b.leaveRequestTypeName?.toLowerCase().includes("annual"));
  const annualLeaveRemaining = annualLeave ? annualLeave.remainingQuotas : 0;
  const totalLeavesTaken = leaveBalance?.reduce((sum, b) => sum + Number(b.approvedQuotas || 0), 0) || 0;

  const { leaveRequestTypes } = useGetLeaveRequestType();
  const { leaveStatuses } = useGetLeaveStatus();
  
  const annualLeaveType = leaveRequestTypes?.find(t => t.name.toLowerCase().includes("phép năm") || t.name.toLowerCase().includes("annual"));
  const approvedStatus = leaveStatuses?.find(s => s.name.toLowerCase() === "approved");

  const activeFilters: Record<string, string> = {};
  if (activeTab === 0 && annualLeaveType) {
    activeFilters.leaveRequestTypeId = annualLeaveType.id;
  } else if (activeTab === 1 && approvedStatus) {
    activeFilters.leaveStatusId = approvedStatus.id;
  }

  const { leaveRequests: recentRequests, total: requestTotal, loading: requestsLoading } = useGetLeaveRequestByEmployeeId(
    employee?.id ?? "",
    activeTab === 0 || activeTab === 1 ? currentPage : 1,
    pageSize,
    undefined,
    undefined,
    activeFilters,
    0
  );

  let currentDataSource: LeaveRequestDto[] = [];
  let currentTotal = 0;
  let currentLoading = false;
  let currentTitle = "";

  if (activeTab === 2) {
    currentDataSource = pendingRequests;
    currentTotal = pendingTotal;
    currentLoading = pendingLoading;
    currentTitle = "My Pending Requests";
  } else if (activeTab === 3) {
    currentDataSource = receiveRequests;
    currentTotal = receiveTotal;
    currentLoading = receiveLoading;
    currentTitle = "Received Requests";
  } else if (activeTab === 0) {
    currentDataSource = recentRequests;
    currentTotal = requestTotal;
    currentLoading = requestsLoading;
    currentTitle = "My Annual Leave Requests";
  } else if (activeTab === 1) {
    currentDataSource = recentRequests;
    currentTotal = requestTotal;
    currentLoading = requestsLoading;
    currentTitle = "My Approved Leaves";
  }

  const cardData = [
    {
      title: "Annual Leave Balance (Days)",
      total: annualLeaveRemaining.toString(),
      icon: <OrderedListOutlined className="text-xl text-blue-500" />,
    },
    {
      title: "Total Leaves Taken (Days)",
      total: totalLeavesTaken.toString(),
      icon: <ClockCircleOutlined className="text-xl text-blue-500" />,
    },
    {
      title: "My Pending Request",
      total: pendingTotal.toString(),
      icon: <EditOutlined className="text-xl text-blue-500" />,
    },
    {
      title: "Receive Requests",
      total: receiveTotal.toString(),
      icon: <FolderOpenOutlined className="text-xl text-blue-500" />,
    },
  ];

  return (
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-6 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
          Working Time
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          {cardData.map((item, index) => (
            <Card
              key={index}
              className={`border rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${
                activeTab === index ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100 hover:border-blue-300"
              }`}
              onClick={() => {
                setActiveTab(index);
                setCurrentPage(1);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {item.total}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{item.title}</div>
                </div>
                <div className="p-2 bg-blue-200 rounded-xl">{item.icon}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {/* Table Section */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-500">
            {currentTitle}
          </h2>
          <a className="text-sm text-blue-600 cursor-pointer hover:underline">
            View All
          </a>
        </div>
        <Table
          columns={columns}
          dataSource={currentDataSource}
          pagination={false}
          rowKey="id"
          loading={currentLoading}
          scroll={{ x: "max-content" }}
        />
        <div className="flex items-center justify-end mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={currentTotal}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
