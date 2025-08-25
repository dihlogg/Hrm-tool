"use client";

import { Modal, Table } from "antd";
import { LeaveBalanceDto } from "@/hooks/leave/LeaveBalanceDto";

interface LeaveBalanceModalProps {
  visible: boolean;
  onClose: () => void;
  leaveBalance: LeaveBalanceDto[];
  loading: boolean;
  employeeName?: string;
  year?: number;
}

export default function LeaveBalanceModal({
  visible,
  onClose,
  leaveBalance,
  loading,
  employeeName,
  year,
}: LeaveBalanceModalProps) {
  const columns = [
    {
      title: (
        <span className="flex justify-center text-base font-medium text-gray-500 select-none">
          Request Name
        </span>
      ),
      dataIndex: "leaveRequestTypeName",
      key: "leaveRequestTypeName",
      width: 200,
      onCell: () => ({
        className: "text-gray-500",
      }),
    },
    {
      title: (
        <span className="text-base font-medium text-gray-500 select-none">
          Unit
        </span>
      ),
      key: "unit",
      render: () => "Day",
      width: 90,
      onCell: () => ({
        className: "text-gray-500",
      }),
    },
    {
      title: (
        <span className="flex justify-center text-base font-medium text-gray-500 select-none">
          Maximum Allowed
        </span>
      ),
      dataIndex: "maximumAllowed",
      key: "maximumAllowed",
      width: 90,
      onCell: () => ({
        className: "text-gray-500",
      }),
    },
    {
      title: (
        <span className="flex justify-center text-base font-medium text-gray-500 select-none">
          Approved Quotas
        </span>
      ),
      dataIndex: "approvedQuotas",
      key: "approvedQuotas",
      width: 90,
      onCell: () => ({
        className: "text-gray-500",
      }),
    },
    {
      title: (
        <span className="flex justify-center text-base font-medium text-gray-500 select-none">
          Pending Quotas
        </span>
      ),
      dataIndex: "pendingQuotas",
      key: "pendingQuotas",
      width: 90,
      onCell: () => ({
        className: "text-gray-500",
      }),
    },
    {
      title: (
        <span className="flex justify-center text-base font-medium text-gray-500 select-none">
          Remaining Quotas
        </span>
      ),
      dataIndex: "remainingQuotas",
      key: "remainingQuotas",
      width: 90,
      onCell: () => ({
        className: "text-gray-500",
      }),
    },
  ];

  return (
    <Modal
      title={
        <span className="text-base font-medium text-gray-600">
          Time Off (Leave) Requests and Balances in{" "}
          {year ?? new Date().getFullYear()} - {" "} 
          <span className="px-1 font-semibold text-blue-600">
            {employeeName ?? ""}
          </span>
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 900 }}
      centered
    >
      <Table
        columns={columns}
        dataSource={leaveBalance}
        rowKey="leaveRequestTypeId"
        loading={loading}
        pagination={false}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
      />
    </Modal>
  );
}
