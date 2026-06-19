"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeletePermissionFromRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteByRoleAndPermission = useCallback(
    async (roleId: string, permissionId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.delete(
          `${API_ENDPOINTS.DELETE_BY_ROLE_AND_PERMISSION}/${roleId}/${permissionId}`,
        );
        return response.data;
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        const message =
          errorObj.response?.data?.message ||
          "Failed to remove permission from role";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { deleteByRoleAndPermission, loading, error };
}
