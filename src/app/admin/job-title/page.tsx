"use client";

import { mockMyRequests } from "@/utils/admin/mock-data-admin-page";
import { Button, Modal, notification, Pagination, Select, Table } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";
import { CreateJobTitleDto } from "@/hooks/employees/job-titles/CreateJobTitleDto";
import { useJobTitles } from "@/hooks/employees/job-titles/useJobTitles";
import { useDeleteJobTitleById } from "@/hooks/employees/job-titles/useDeleteJobTitleById";

export default function JobTitlePage() {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);

  const { jobTitles } = useJobTitles(hotReload);
  const { deleteJobTitle } = useDeleteJobTitleById();
  //modal
  const [selectedJob, setSelectedJob] = useState<CreateJobTitleDto | null>(
    null
  );
  const [isModalOpen, setIsOpenModal] = useState(false);
  const handleCancel = () => {
    setIsOpenModal(false);
  };
  const handleOk = async () => {
    if (selectedJob?.id) {
      try {
        await deleteJobTitle(selectedJob.id);
        setIsOpenModal(false);
        setSelectedJob(null);
        setHotReload((prev) => prev + 1);
        api.success({
          message: "Delete Job Title Successfully!",
          description: `Job Title information has been deleted.`,
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
      } catch (err: any) {
        api.error({
          message: "Delete Job Title failed!",
          description: "Job Title information has not been deleted",
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModal(false);
      }
    }
  };

  const columns: ColumnsType<CreateJobTitleDto> = [
    {
      title: <span className="select-none">No</span>,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: <span className="select-none">Job Titles</span>,
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Job Description</span>,
      dataIndex: "description",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Actions</span>,
      key: "actions",
      render: (_: any, record: CreateJobTitleDto) => (
        <div className="flex gap-4">
          <Button
            type="default"
            shape="circle"
            onClick={() =>
              router.push(`/admin/job-title/edit-job-title?id=${record.id}`)
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
              setSelectedJob(record);
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
              Job Titles
            </h2>
            <Button
              type="primary"
              shape="round"
              size="large"
              className="!mb-1 text-white bg-blue-500 hover:bg-blue-600"
              onClick={() =>
              router.push(`/admin/job-title/add-job-title`)
            }
            >
              + Add
            </Button>
          </div>
          <div className="flex items-center justify-between mt-6 mb-4">
            <h2 className="px-2 text-lg font-semibold text-gray-500">
              ({jobTitles.length ?? 0}) Records Found
            </h2>
          </div>
          <Table
            columns={columns}
            dataSource={jobTitles}
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
          Are you sure you want to delete this job title:{" "}
          {selectedJob ? `${selectedJob.name}` : "this job title"}
        </span>
        <p className="mt-2 text-sm text-gray-500">
          This action will delete the job title from the system!
        </p>
      </Modal>
    </>
  );
}
