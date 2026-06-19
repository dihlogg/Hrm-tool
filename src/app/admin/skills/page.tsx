"use client";

import { Button, Modal, notification, Table } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";
import { SkillDto } from "@/hooks/ats/skills/SkillDto";
import { useSkills } from "@/hooks/ats/skills/useSkills";
import { useDeleteSkillById } from "@/hooks/ats/skills/useDeleteSkillById";

export default function SkillsPage() {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);

  const { skills } = useSkills(hotReload);
  const { deleteSkill } = useDeleteSkillById();

  //modal
  const [selectedSkill, setSelectedSkill] = useState<SkillDto | null>(
    null
  );
  const [isModalOpen, setIsOpenModal] = useState(false);
  
  const handleCancel = () => {
    setIsOpenModal(false);
  };
  
  const handleOk = async () => {
    if (selectedSkill?.id) {
      try {
        await deleteSkill(selectedSkill.id);
        setIsOpenModal(false);
        setSelectedSkill(null);
        setHotReload((prev) => prev + 1);
        api.success({
          message: "Delete Skill Successfully!",
          description: `Skill information has been deleted.`,
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
      } catch {
        api.error({
          message: "Delete Skill failed!",
          description: "Skill information has not been deleted",
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModal(false);
      }
    }
  };

  const columns: ColumnsType<SkillDto> = [
    {
      title: <span className="select-none">No</span>,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: <span className="select-none">Skill Name</span>,
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Category</span>,
      dataIndex: "category",
      render: (text: string) => <span>{text || "Uncategorized"}</span>,
    },
    {
      title: <span className="select-none">Actions</span>,
      key: "actions",
      render: (_: unknown, record: SkillDto) => (
        <div className="flex gap-4">
          <Button
            type="default"
            shape="circle"
            onClick={() =>
              router.push(`/admin/skills/edit-skill?id=${record.id}`)
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
              setSelectedSkill(record);
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
              Skills Dictionary
            </h2>
            <Button
              type="primary"
              shape="round"
              size="large"
              className="!mb-1 text-white bg-blue-500 hover:bg-blue-600"
              onClick={() =>
              router.push(`/admin/skills/add-skill`)
            }
            >
              + Add
            </Button>
          </div>
          <div className="flex items-center justify-between mt-6 mb-4">
            <h2 className="px-2 text-lg font-semibold text-gray-500">
              ({skills?.length ?? 0}) Records Found
            </h2>
          </div>
          <Table
            columns={columns}
            dataSource={skills as unknown as readonly SkillDto[]}
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
          Are you sure you want to delete this skill:{" "}
          {selectedSkill ? `${selectedSkill.name}` : "this skill"}
        </span>
        <p className="mt-2 text-sm text-gray-500">
          This action will delete the skill from the system!
        </p>
      </Modal>
    </>
  );
}
