"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteByUserAndPermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteByUserAndPermission = useCallback(
    async (userId: string, permissionId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.delete(
          `${API_ENDPOINTS.DELETE_BY_USER_AND_PERMISSION}/${userId}/${permissionId}`,
        );
        return response.data;
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        const message =
          errorObj.response?.data?.message ||
          "Failed to remove permission from user";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { deleteByUserAndPermission, loading, error };
}
