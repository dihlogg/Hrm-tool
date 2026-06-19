"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeletePermissionFromUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePermissionFromUser = useCallback(
    async (userPermissionId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.delete(
          `${API_ENDPOINTS.DELETE_PERMISSION_FROM_USER}/${userPermissionId}`,
        );
        return response.data;
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        const message =
          errorObj.response?.data?.message ||
          "Failed to remove permission exception";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { deletePermissionFromUser, loading, error };
}
