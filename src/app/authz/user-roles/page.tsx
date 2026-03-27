"use client";

import React, { useEffect, useState } from "react";
import { Button, Checkbox, notification, Spin, Input } from "antd";
import { useGetAllRoles } from "@/hooks/roles/useGetAllRoles";
import { useGetUsers } from "@/hooks/users/useGetUser";
import {
  SearchOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAssignRoleToUser } from "@/hooks/permissions/user-roles/useAssignRoleToUser";
import { useDeleteRoleFromUser } from "@/hooks/permissions/user-roles/useDeleteRoleFromUser";

export default function UserRolesPage() {
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const { roles, loading: loadingRoles } = useGetAllRoles(hotReload);

  const { users, loading: loadingUsers } = useGetUsers(
    1,
    50,
    undefined,
    undefined,
    { userName: searchTerm },
    hotReload,
  );

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );
  const [initialUserIds, setInitialUserIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const { assignRoleToUser } = useAssignRoleToUser();
  const { deleteRoleFromUser } = useDeleteRoleFromUser();

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id!);
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (selectedRoleId && users.length > 0) {
      const uIds = new Set(
        users
          .filter((u) =>
            u.userRole?.some((ur) => ur.role?.id === selectedRoleId),
          )
          .map((u) => u.id!),
      );
      setSelectedUserIds(uIds);
      setInitialUserIds(new Set(uIds));
    } else {
      setSelectedUserIds(new Set());
      setInitialUserIds(new Set());
    }
  }, [selectedRoleId, users]);

  const activeRole = roles.find((r) => r.id === selectedRoleId);

  const toggleUser = (userId: string) => {
    const newSet = new Set(selectedUserIds);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUserIds(newSet);
  };

  const isAllSelected =
    users.length > 0 && selectedUserIds.size === users.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(users.map((u) => u.id!)));
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedRoleId) return;
    setIsSaving(true);

    try {
      const usersToAdd = [...selectedUserIds].filter(
        (id) => !initialUserIds.has(id),
      );
      const usersToRemove = [...initialUserIds].filter(
        (id) => !selectedUserIds.has(id),
      );

      for (const userId of usersToAdd) {
        await assignRoleToUser({
          userId,
          roleId: selectedRoleId,
        });
      }

      for (const userId of usersToRemove) {
        await deleteRoleFromUser(userId, selectedRoleId);
      }

      api.success({
        message: "Role Assignments Updated",
        description: `Successfully updated users for the ${activeRole?.name} role.`,
        placement: "bottomLeft",
      });

      setInitialUserIds(new Set(selectedUserIds));
      setHotReload((prev) => prev + 1);
    } catch (error: any) {
      api.error({
        message: "Update Failed",
        description:
          error.message || "An error occurred while saving role assignments.",
        placement: "bottomLeft",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col w-full px-4 py-6 lg:px-8">
        {/* Header row */}
        <div className="flex gap-6 mb-4">
          <div className="w-[280px] shrink-0 flex items-start">
            <h3 className="text-lg font-medium text-gray-700">System Roles</h3>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-800">
              Users assigned to:{" "}
              <span className="text-[#2F54EB]">
                {activeRole?.name || "..."}
              </span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select users below to grant or revoke this role.
            </p>
          </div>
        </div>

        {/* Content row */}
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Roles sidebar (Left) */}
          <div className="w-[280px] shrink-0">
            <div className="h-full p-3 overflow-y-auto bg-white border border-gray-200 shadow-sm rounded-xl custom-scrollbar">
              {loadingRoles ? (
                <div className="py-10 text-center">
                  <Spin />
                </div>
              ) : roles.length === 0 ? (
                <div className="py-10 text-sm text-center text-gray-400">
                  No roles found.
                </div>
              ) : (
                <ul className="flex flex-col space-y-1">
                  {roles.map((role) => {
                    const isActive = selectedRoleId === role.id;
                    return (
                      <li
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id!)}
                        className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                          isActive
                            ? "bg-[#2F54EB] text-white shadow-md"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <SafetyCertificateOutlined
                          className={isActive ? "text-white" : "text-gray-400"}
                        />
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-[14px] font-medium truncate ${isActive ? "text-white" : "text-gray-800"}`}
                          >
                            {role.name}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Users content (Right) */}
          <div className="flex flex-col flex-1 h-full min-w-0">
            <div className="bg-[#FAFAFA] border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2 font-bold tracking-wide text-gray-600 uppercase text-[13px]">
                  <TeamOutlined className="text-lg" /> Users List
                </div>

                <div className="flex items-center gap-4">
                  <Input
                    size="middle"
                    placeholder="Search users..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 rounded-lg bg-gray-50 hover:bg-white focus:bg-white"
                    allowClear
                  />
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 transition bg-gray-100 cursor-pointer rounded-full hover:bg-gray-200 shrink-0"
                    onClick={toggleSelectAll}
                  >
                    <Checkbox
                      checked={isAllSelected}
                      className="pointer-events-none custom-round-checkbox"
                    />
                    <span className="text-[13px] font-medium text-gray-600">
                      Select All
                    </span>
                  </div>
                </div>
              </div>

              {/* List Cards */}
              <div className="flex-1 p-6 overflow-y-auto">
                {loadingUsers || loadingRoles ? (
                  <div className="py-10 text-center">
                    <Spin size="large" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="py-10 text-sm text-center text-gray-400">
                    No users match your search.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {users.map((user) => {
                      const isChecked = selectedUserIds.has(user.id!);
                      const firstName = user.employee?.firstName || "";
                      const lastName = user.employee?.lastName || "";
                      const fullName = user.employee
                        ? `${firstName} ${lastName}`.trim()
                        : user.userName;

                      return (
                        <div
                          key={user.id}
                          onClick={() => toggleUser(user.id!)}
                          className={`flex items-center gap-4 p-4 transition-all duration-200 bg-white border rounded-xl cursor-pointer group ${
                            isChecked
                              ? "border-[#2F54EB] shadow-[0_2px_10px_rgba(47,84,235,0.15)] ring-1 ring-[#2F54EB]/20"
                              : "border-gray-200 hover:border-[#2F54EB]/50 hover:shadow-sm"
                          }`}
                        >
                          <div className="pointer-events-none">
                            <Checkbox
                              checked={isChecked}
                              className="custom-round-checkbox"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[15px] font-semibold text-gray-800 truncate block">
                              {fullName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Save Changes */}
              <div className="flex justify-end px-6 py-4 bg-white border-t border-gray-200">
                <Button
                  type="primary"
                  size="large"
                  loading={isSaving}
                  onClick={handleSaveChanges}
                  disabled={
                    !selectedRoleId ||
                    (selectedUserIds.size === initialUserIds.size &&
                      [...selectedUserIds].every((id) =>
                        initialUserIds.has(id),
                      ))
                  }
                  className="font-medium text-white transition-transform shadow-md bg-[#2F54EB] hover:!bg-[#1D39C4] rounded-lg active:scale-95"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
