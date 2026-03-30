"use client";

import React, { useEffect, useState } from "react";
import { Button, Checkbox, notification, Spin, Input } from "antd";
import { useGetUsers } from "@/hooks/users/useGetUser";
import { useGetAllPermissions } from "@/hooks/permissions/useGetAllPermissions";
import { useGetPermissionsByRoleId } from "@/hooks/permissions/useGetPermissionsByRoleId";
import {
  SearchOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAssignPermissionToUser } from "@/hooks/permissions/user-permissions/useAssignPermissionToUser";
import { useDeleteByUserAndPermission } from "@/hooks/permissions/user-permissions/useDeleteByUserAndPermission";
import { useGetUserPermissionsByUserId } from "@/hooks/permissions/user-permissions/useGetUserPermissionsByUserId";

export default function UserPermissionsPage() {
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [userPage, setUserPage] = useState(1);

  // States
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPermIds, setSelectedPermIds] = useState<Set<string>>(
    new Set(),
  );
  const [initialPermIds, setInitialPermIds] = useState<Set<string>>(new Set());
  const [rolePermIds, setRolePermIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const { users, loading: loadingUsers } = useGetUsers(
    userPage,
    1000,
    undefined,
    undefined,
    { userName: searchTerm },
    hotReload,
  );

  const { permissions, loading: loadingPerms } =
    useGetAllPermissions(hotReload);
  const { assignUserPermission } = useAssignPermissionToUser();
  const { deleteByUserAndPermission } = useDeleteByUserAndPermission();
  const { userPermissions, loading: loadingUserPerms } =
    useGetUserPermissionsByUserId(selectedUserId, hotReload);

  const activeUser = users.find((u) => u.id === selectedUserId);
  const activeUserFullName = activeUser?.employee
    ? `${activeUser.employee.firstName} ${activeUser.employee.lastName}`.trim()
    : activeUser?.userName;
  const primaryRoleId = activeUser?.userRole?.[0]?.role?.id;

  const { rolePermissions, loading: loadingRolePerms } =
    useGetPermissionsByRoleId(primaryRoleId, hotReload);

  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id!);
    }
  }, [users, selectedUserId]);

  useEffect(() => {
    if (userPermissions && userPermissions.length > 0) {
      const permIds = new Set(
        userPermissions
          .filter((up: any) => up.isGranted)
          .map((up: any) => up.permissionId),
      );
      setSelectedPermIds(permIds);
      setInitialPermIds(new Set(permIds));
    } else {
      setSelectedPermIds(new Set());
      setInitialPermIds(new Set());
    }
  }, [userPermissions, selectedUserId]);

  useEffect(() => {
    if (rolePermissions && rolePermissions.length > 0) {
      setRolePermIds(new Set(rolePermissions.map((p: any) => p.id)));
    } else {
      setRolePermIds(new Set());
    }
  }, [rolePermissions]);

  const togglePermission = (permId: string) => {
    const newSet = new Set(selectedPermIds);
    if (newSet.has(permId)) {
      newSet.delete(permId);
    } else {
      newSet.add(permId);
    }
    setSelectedPermIds(newSet);
  };

  const isAllSelected =
    permissions.length > 0 &&
    permissions.every(
      (p) => selectedPermIds.has(p.id!) || rolePermIds.has(p.id!),
    );

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPermIds(new Set());
    } else {
      const newSet = new Set(selectedPermIds);
      permissions.forEach((p) => {
        if (!rolePermIds.has(p.id!)) {
          newSet.add(p.id!);
        }
      });
      setSelectedPermIds(newSet);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedUserId) return;
    setIsSaving(true);

    try {
      const permsToAdd = [...selectedPermIds].filter(
        (id) => !initialPermIds.has(id),
      );

      const permsToRemove = [...initialPermIds].filter(
        (id) => !selectedPermIds.has(id),
      );

      for (const permId of permsToAdd) {
        await assignUserPermission({
          userId: selectedUserId,
          permissionId: permId,
          isGranted: true,
        });
      }

      for (const permId of permsToRemove) {
        await deleteByUserAndPermission(selectedUserId, permId);
      }

      api.success({
        message: "Permissions Updated",
        description: `Successfully updated exceptional permissions for ${activeUserFullName}.`,
        placement: "bottomLeft",
      });

      setInitialPermIds(new Set(selectedPermIds));
      setHotReload((prev) => prev + 1);
    } catch (error: any) {
      api.error({
        message: "Update Failed",
        description:
          error.message || "An error occurred while saving user permissions.",
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
        <div className="flex gap-6 mb-4">
          <div className="w-[320px] shrink-0 flex items-start">
            <h3 className="text-lg font-medium text-gray-700">System Users</h3>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-800">
              Permissions for:{" "}
              <span className="text-[#2F54EB]">
                {activeUserFullName || "..."}
              </span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select permissions below to grant exceptional access for this
              specific user.
            </p>
          </div>
        </div>

        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Users sidebar (Left) */}
          <div className="w-[320px] shrink-0 flex flex-col gap-3 h-full">
            <Input
              size="middle"
              placeholder="Search users..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white rounded-lg shrink-0"
              allowClear
            />
            <div className="flex-1 min-h-0 p-3 overflow-y-auto bg-white border border-gray-200 shadow-sm rounded-xl">
              {loadingUsers ? (
                <div className="py-10 text-center">
                  <Spin />
                </div>
              ) : users.length === 0 ? (
                <div className="py-10 text-sm text-center text-gray-400">
                  No users found.
                </div>
              ) : (
                <ul className="flex flex-col space-y-1">
                  {users.map((user) => {
                    const isActive = selectedUserId === user.id;
                    const fullName = user.employee
                      ? `${user.employee.firstName} ${user.employee.lastName}`.trim()
                      : user.userName;

                    return (
                      <li
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id!)}
                        className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                          isActive
                            ? "bg-[#2F54EB] text-white shadow-md"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <UserOutlined
                          className={isActive ? "text-white" : "text-gray-400"}
                        />
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-[14px] font-medium truncate ${isActive ? "text-white" : "text-gray-800"}`}
                          >
                            {fullName}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Permissions content (Right) */}
          <div className="flex flex-col flex-1 h-full min-w-0">
            <div className="bg-[#FAFAFA] border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2 font-bold tracking-wide text-gray-600 uppercase text-[13px]">
                  <AppstoreOutlined className="text-lg" /> Permissions List
                </div>

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

              <div className="flex-1 p-6 overflow-y-auto">
                {loadingPerms || loadingUserPerms || loadingRolePerms ? (
                  <div className="py-10 text-center">
                    <Spin size="large" />
                  </div>
                ) : permissions.length === 0 ? (
                  <div className="py-10 text-sm text-center text-gray-400">
                    No permissions available.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {permissions.map((perm) => {
                      const isDirectlyGranted = selectedPermIds.has(perm.id!);
                      const isInherited = rolePermIds.has(perm.id!);
                      const isChecked = isDirectlyGranted || isInherited;

                      return (
                        <div
                          key={perm.id}
                          onClick={() => {
                            if (!isInherited) togglePermission(perm.id!);
                          }}
                          className={`flex items-start gap-4 p-4 transition-all duration-200 bg-white border rounded-xl group ${
                            isChecked
                              ? "border-[#2F54EB] shadow-[0_2px_10px_rgba(47,84,235,0.15)] ring-1 ring-[#2F54EB]/20"
                              : "border-gray-200 hover:border-[#2F54EB]/50 hover:shadow-sm"
                          } ${isInherited ? "cursor-default bg-gray-50 opacity-90" : "cursor-pointer"}`}
                        >
                          <div className="mt-0.5 pointer-events-none">
                            <Checkbox
                              checked={isChecked}
                              disabled={isInherited}
                              className="custom-round-checkbox"
                            />
                          </div>

                          <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[15px] font-semibold text-gray-800 break-words">
                                {perm.name}
                              </span>

                              <div className="flex flex-wrap justify-end gap-1 shrink-0">
                                {isInherited && (
                                  <span className="px-2 py-0.5 text-[10px] font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md whitespace-nowrap">
                                    Role
                                  </span>
                                )}
                                {isDirectlyGranted && (
                                  <span className="px-2 py-0.5 text-[10px] font-medium text-green-600 bg-green-50 border border-green-200 rounded-md whitespace-nowrap">
                                    Exception
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className="text-[13px] text-gray-500 line-clamp-2">
                              {perm.description ||
                                `Allow exceptional access to the ${perm.code} module.`}
                            </span>
                            <div className="mt-1">
                              <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#D97706] bg-[#FEF3C7] rounded-md border border-[#FDE68A]">
                                {perm.code}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end px-6 py-4 bg-white border-t border-gray-200">
                <Button
                  type="primary"
                  size="large"
                  loading={isSaving}
                  onClick={handleSaveChanges}
                  disabled={
                    !selectedUserId ||
                    (selectedPermIds.size === initialPermIds.size &&
                      [...selectedPermIds].every((id) =>
                        initialPermIds.has(id),
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
