"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteRoleFromUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRoleFromUser = useCallback(
    async (userId: string, roleId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.delete(
          `${API_ENDPOINTS.DELETE_ROLE_FROM_USER}/${userId}/${roleId}`,
        );
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Failed to remove role from user";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { deleteRoleFromUser, loading, error };
}
