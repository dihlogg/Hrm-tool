"use client";

import { Button, Modal, notification, Table } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";
import { LeaveTypeDto } from "@/hooks/leave/leave-types/LeaveTypeDto";
import { useLeaveTypes } from "@/hooks/leave/leave-types/useLeaveTypes";
import { useDeleteLeaveTypeById } from "@/hooks/leave/leave-types/useDeleteLeaveTypeById";

export default function LeaveTypePage() {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);

  const { leaveTypes } = useLeaveTypes(hotReload);
  const { deleteLeaveType } = useDeleteLeaveTypeById();

  //modal
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeDto | null>(
    null
  );
  const [isModalOpen, setIsOpenModal] = useState(false);
  
  const handleCancel = () => {
    setIsOpenModal(false);
  };
  
  const handleOk = async () => {
    if (selectedLeaveType?.id) {
      try {
        await deleteLeaveType(selectedLeaveType.id);
        setIsOpenModal(false);
        setSelectedLeaveType(null);
        setHotReload((prev) => prev + 1);
        api.success({
          message: "Delete Leave Type Successfully!",
          description: `Leave Type information has been deleted.`,
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
      } catch {
        api.error({
          message: "Delete Leave Type failed!",
          description: "Leave Type information has not been deleted",
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModal(false);
      }
    }
  };

  const columns: ColumnsType<LeaveTypeDto> = [
    {
      title: <span className="select-none">No</span>,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: <span className="select-none">Name</span>,
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Description</span>,
      dataIndex: "description",
      width: 400,
      render: (text: string) => (
        <span className="block whitespace-normal break-words max-w-[400px]">
          {text}
        </span>
      ),
    },
    {
      title: <span className="select-none">Unit</span>,
      dataIndex: "unit",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Max Allowed</span>,
      dataIndex: "maximumAllowed",
      render: (text: number) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Max Carry Over</span>,
      dataIndex: "maxCarryOver",
      render: (text: number) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Expire Month</span>,
      dataIndex: "expireMonth",
      render: (text: number) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Actions</span>,
      key: "actions",
      render: (_: unknown, record: LeaveTypeDto) => (
        <div className="flex gap-4">
          <Button
            type="default"
            shape="circle"
            onClick={() =>
              router.push(`/admin/leave-types/edit-leave-type?id=${record.id}`)
            }
            className="p-2 text-blue-600 cursor-pointer hover:text-blue-800"
          >
            <EditOutlined style={{ fontSize: "16px", color: "#6B7280" }} />
          </Button>
          <Button
            type="default"
            shape="circle"
            className="p-2 text-red-600 cursor-pointer hover:text-red-800"
            onClick={() => {
              setSelectedLeaveType(record);
              setIsOpenModal(true);
            }}
          >
            <DeleteOutlined style={{ fontSize: "16px", color: "#6B7280" }} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        {/* Table Section */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex justify-between p-2 border-b border-b-gray-400">
            <h2 className="pt-2 text-xl font-semibold text-gray-500">
              Leave Types
            </h2>
            <Button
              type="primary"
              shape="round"
              size="large"
              className="!mb-1 text-white bg-blue-500 hover:bg-blue-600"
              onClick={() =>
              router.push(`/admin/leave-types/add-leave-type`)
            }
            >
              + Add
            </Button>
          </div>
          <div className="flex items-center justify-between mt-6 mb-4">
            <h2 className="px-2 text-lg font-semibold text-gray-500">
              ({leaveTypes.length ?? 0}) Records Found
            </h2>
          </div>
          <Table
            columns={columns}
            dataSource={leaveTypes as unknown as readonly LeaveTypeDto[]}
            pagination={false}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>
      <Modal
        title="Confirm Delete"
        closable={true}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
      >
        <span className="text-sm font-medium text-gray-500">
          Are you sure you want to delete this leave type:{" "}
          {selectedLeaveType ? `${selectedLeaveType.name}` : "this leave type"}
        </span>
        <p className="mt-2 text-sm text-gray-500">
          This action will delete the leave type from the system!
        </p>
      </Modal>
    </>
  );
}
