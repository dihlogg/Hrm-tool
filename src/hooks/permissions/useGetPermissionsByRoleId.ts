"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { PermissionDto } from "./PermissionDto";

export function useGetPermissionsByRoleId(
  roleId: string | undefined,
  hotReload: number = 0,
) {
  const [rolePermissions, setRolePermissions] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roleId) return;

    const loadPermissions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_PERMISSIONS_BY_ROLE_ID}/${roleId}`,
        );
        setRolePermissions(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load permissions for this role",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [roleId, hotReload]);

  return { rolePermissions, loading, error };
}
