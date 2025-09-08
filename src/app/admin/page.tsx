"use client";

import { Button, notification, Pagination, Select, Table } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ColumnsType, SortOrder } from "antd/es/table/interface";
import { useUserStatuses } from "@/hooks/users/user-statuses/useUserStatuses";
import { getInitialFilters, UserFilters } from "@/hooks/users/UserFiltersDto";
import { useGetUsers } from "@/hooks/users/useGetUser";
import { antdSortOrderToApiOrder } from "@/utils/tableSorting";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";
import { exportExcel } from "@/utils/exportExcel";
import { UserDto } from "@/hooks/users/UserDto";
import { useGetAllRoles } from "@/hooks/roles/useGetAllRoles";

const { Option } = Select;

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);

  const { userStatuses, error: userStatusError } = useUserStatuses();
  const { roles, error: roleError } = useGetAllRoles();

  //filter
  const [filters, setFilters] = useState<UserFilters>(getInitialFilters);
  const [filterDrafts, setFilterDrafts] =
    useState<UserFilters>(getInitialFilters);

  const { users, total, loading } = useGetUsers(
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
      case "userStatusId":
        return "userStatus";
      default:
        return field;
    }
  }

  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_USER_LIST, {
        params: { page: 1, pageSize: total },
      });
      const allUsers = response.data.data;
      exportExcel(columns, allUsers, "User_List.xlsx", "User List");
    } catch (err) {
      console.error("Export Excel failed:", err);
    }
  };
  const router = useRouter();

  const columns: ColumnsType<UserDto> = [
    {
      title: (
        <span className="text-sm font-semibold text-gray-600 select-none">
          UserName
        </span>
      ),
      dataIndex: "userName",
      sorter: true,
      sortOrder: sortBy === "userName" ? sortOrder : undefined,
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600 select-none">
          Employee Name
        </span>
      ),
      key: "employeeName",
      render: (_, record) => (
        <span>
          {record.employee
            ? `${record.employee.lastName} ${record.employee.firstName}`
            : "N/A"}
        </span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600 select-none">
          User Role
        </span>
      ),
      key: "userRole",
      render: (_, record) => (
        <span className="">
          {record.userRole && record.userRole.length > 0
            ? record.userRole
                .map((ur) => ur.role?.name)
                .filter(Boolean)
                .join(", ")
            : "N/A"}
        </span>
      ),
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600 select-none">
          Employee Status
        </span>
      ),
      dataIndex: "userStatusId",
      sorter: true,
      sortOrder: sortBy === "userStatus" ? sortOrder : undefined,
      render: (_, record) => record.userStatus?.name || "",
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600 select-none">
          Actions
        </span>
      ),
      key: "actions",
      render: (_: any, record: UserDto) => (
        <div className="flex gap-4">
          <Button
            type="default"
            shape="circle"
            onClick={() => router.push(`/admin/edit-user?id=${record.id}`)}
            className="p-2 text-gray-600 cursor-pointer hover:text-blue-800"
          >
            <EditOutlined style={{ fontSize: "16px", color: "#6B7280" }} />
          </Button>
          <Button
            type="default"
            shape="circle"
            className="p-2 text-gray-600 cursor-pointer hover:text-blue-800"
            onClick={() => {}}
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
                value={filterDrafts.userName}
                onChange={(e) => {
                  setFilterDrafts((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }));
                }}
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
                value={filterDrafts.employeeName}
                onChange={(e) => {
                  setFilterDrafts((prev) => ({
                    ...prev,
                    employeeName: e.target.value,
                  }));
                }}
              />
            </div>
            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                Status
              </label>
              <Select
                className="w-full !mt-2 custom-select"
                placeholder="--Select--"
                allowClear
                value={filterDrafts.userStatusId || null}
                onChange={(value) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    userStatusId: value,
                  }))
                }
              >
                {userStatuses.map((userStatus) => (
                  <Option key={userStatus.id} value={userStatus.id}>
                    {userStatus.name}
                  </Option>
                ))}
              </Select>
              {userStatusError && (
                <p className="mt-1 text-sm text-red-500">{userStatusError}</p>
              )}
            </div>
            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                User Role
              </label>
              <Select
                className="w-full !mt-2 custom-select"
                placeholder="--Select--"
                allowClear
                value={filterDrafts.roleId || null}
                onChange={(value) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    roleId: value,
                  }))
                }
              >
                {roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
              {roleError && (
                <p className="mt-1 text-sm text-red-500">{roleError}</p>
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
              onClick={() => {
                const initial = getInitialFilters();
                setFilterDrafts(initial);
                setSortOrder(undefined);
                setFilters(initial);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              shape="round"
              size="middle"
              className="text-white bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                setFilters(filterDrafts);
                setCurrentPage(1);
              }}
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
            dataSource={users}
            pagination={false}
            rowKey="id"
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
    </>
  );
}
