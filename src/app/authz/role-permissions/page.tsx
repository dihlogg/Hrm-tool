"use client";

import React, { useEffect, useState } from "react";
import { Button, Checkbox, notification, Spin } from "antd";
import { useGetAllRoles } from "@/hooks/roles/useGetAllRoles";
import { useGetAllPermissions } from "@/hooks/permissions/useGetAllPermissions";
import { useGetPermissionsByRoleId } from "@/hooks/permissions/useGetPermissionsByRoleId";
import { AppstoreOutlined } from "@ant-design/icons";
import { useAssignPermissionToRole } from "@/hooks/permissions/role-permissions/useAssignPermissionToRole";
import { useDeletePermissionFromRole } from "@/hooks/permissions/role-permissions/useDeletePermissionFromRole";

export default function RolePermissionsPage() {
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);

  const { roles, loading: loadingRoles } = useGetAllRoles(hotReload);
  const { permissions, loading: loadingPerms } =
    useGetAllPermissions(hotReload);

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedPermIds, setSelectedPermIds] = useState<Set<string>>(
    new Set(),
  );
  const [initialPermIds, setInitialPermIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const { rolePermissions, loading: loadingRolePerms } =
    useGetPermissionsByRoleId(selectedRoleId || undefined, hotReload);

  const { assignPermission } = useAssignPermissionToRole();
  const { deleteByRoleAndPermission } = useDeletePermissionFromRole();

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (rolePermissions && rolePermissions.length > 0) {
      const permIds = new Set(rolePermissions.map((rp: any) => rp.id));

      setSelectedPermIds(permIds);
      setInitialPermIds(new Set(permIds));
    } else {
      setSelectedPermIds(new Set());
      setInitialPermIds(new Set());
    }
  }, [rolePermissions, selectedRoleId]);

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
    permissions.length > 0 && selectedPermIds.size === permissions.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPermIds(new Set());
    } else {
      setSelectedPermIds(new Set(permissions.map((p) => p.id!)));
    }
  };

  const activeRole = roles.find((r) => r.id === selectedRoleId);

  const handleSaveChanges = async () => {
    if (!selectedRoleId) return;
    setIsSaving(true);

    try {
      const permsToAdd = [...selectedPermIds].filter(
        (id) => !initialPermIds.has(id),
      );
      const permsToRemove = [...initialPermIds].filter(
        (id) => !selectedPermIds.has(id),
      );

      for (const permId of permsToAdd) {
        await assignPermission({
          roleId: selectedRoleId,
          permissionId: permId,
        });
      }

      for (const permId of permsToRemove) {
        await deleteByRoleAndPermission(selectedRoleId, permId);
      }

      api.success({
        message: "Permissions Updated",
        description: `Successfully updated permissions for ${activeRole?.name}`,
        placement: "bottomLeft",
      });

      setInitialPermIds(new Set(selectedPermIds));
      setHotReload((prev) => prev + 1);
    } catch (error: any) {
      api.error({
        message: "Update Failed",
        description:
          error.message || "An error occurred while saving permissions.",
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
            <h3 className="text-lg font-medium text-gray-700">
              Available Roles
            </h3>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-800">
              Permissions for: {activeRole?.name || "..."}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure access levels for this role by selecting the permissions
              below.
            </p>
          </div>
        </div>

        {/* Content row */}
        <div className="flex gap-6">
          {/* Roles sidebar */}
          <div className="w-[280px] shrink-0">
            <div className="p-3 bg-white border border-gray-200 shadow-sm rounded-xl">
              {loadingRoles ? (
                <div className="py-4 text-center">
                  <Spin />
                </div>
              ) : (
                <ul className="flex flex-col space-y-1">
                  {roles.map((role) => {
                    const isActive = selectedRoleId === role.id;
                    return (
                      <li
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`px-4 py-2.5 rounded-lg cursor-pointer text-[15px] font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#2F54EB] text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {role.name}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Permissions content */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="bg-[#FAFAFA] border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
              {/* Toolbar (Select All) */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2 font-bold tracking-wide text-gray-600 uppercase text-[13px]">
                  <AppstoreOutlined className="text-lg" /> Permissions
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 transition bg-gray-100 cursor-pointer rounded-full hover:bg-gray-200"
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

              {/* List Cards */}
              <div className="p-6 overflow-y-auto">
                {loadingPerms || loadingRolePerms ? (
                  <div className="py-10 text-center">
                    <Spin size="large" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {permissions.map((perm) => {
                      const isChecked = selectedPermIds.has(perm.id!);
                      return (
                        <div
                          key={perm.id}
                          onClick={() => togglePermission(perm.id!)}
                          className={`flex items-start gap-4 p-4 transition-all duration-200 bg-white border rounded-xl cursor-pointer group ${
                            isChecked
                              ? "border-[#2F54EB] shadow-[0_2px_10px_rgba(47,84,235,0.15)] ring-1 ring-[#2F54EB]/20"
                              : "border-gray-200 hover:border-[#2F54EB]/50 hover:shadow-sm"
                          }`}
                        >
                          <div className="mt-0.5 pointer-events-none">
                            <Checkbox
                              checked={isChecked}
                              className="custom-round-checkbox"
                            />
                          </div>

                          <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                            <span className="text-[15px] font-semibold text-gray-800 break-words">
                              {perm.name}
                            </span>
                            <span className="text-[13px] text-gray-500 line-clamp-2">
                              {perm.description ||
                                `Allow users to access the ${perm.code} module.`}
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

              {/* Save Changes */}
              <div className="flex justify-end px-6 py-4 bg-white border-t border-gray-200">
                <Button
                  type="primary"
                  size="large"
                  loading={isSaving}
                  onClick={handleSaveChanges}
                  disabled={
                    !selectedRoleId ||
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
