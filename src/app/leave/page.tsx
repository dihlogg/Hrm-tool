"use client";

import { Button, DatePicker, Pagination, Select, Table, Card } from "antd";
import { useState } from "react";
import {
  OrderedListOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { mockMyRequests } from "@/utils/leave/mock-data-leave-dash";

const cardData = [
  {
    title: "My Abnormal Case",
    total: "7",
    icon: <OrderedListOutlined className="text-xl text-blue-500" />,
  },
  {
    title: "My Late Coming - Early Leave",
    total: "4",
    icon: <ClockCircleOutlined className="text-xl text-blue-500" />,
  },
  {
    title: "My Pending Request",
    total: "12",
    icon: <EditOutlined className="text-xl text-blue-500" />,
  },
  {
    title: "Receive Requests",
    total: "14",
    icon: <FolderOpenOutlined className="text-xl text-blue-500" />,
  },
];

const columns = [
  { title: "Date", dataIndex: "Date", key: "Date" },
  { title: "Abnormal Type", dataIndex: "AbnormalType", key: "AbnormalType" },
  { title: "Request Type", dataIndex: "RequestType", key: "RequestType" },
  { title: "Request Status", dataIndex: "Status", key: "Status" },
  { title: "Partial Days", dataIndex: "PartialDays", key: "PartialDays" },
];

export default function LeavePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const paginatedData = mockMyRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex-1 w-full p-4 mb-4 space-y-6">
      {/* Filter Section */}
      <div className="flex-col px-8 py-6 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="text-xl font-semibold">Working Time</h2>
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          {cardData.map((item, index) => (
            <Card
              key={index}
              className="border border-gray-100 rounded-lg shadow-sm"
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
          <h2 className="text-xl font-semibold">My Abnormal Cases</h2>
          <a className="text-sm text-blue-600 cursor-pointer hover:underline">
            View All
          </a>
        </div>
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey={"AbnormalType"}
          scroll={{ x: 'max-content' }}
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
