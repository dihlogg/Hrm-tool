"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteRoleById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

  const deleteRole = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_ROLE}/${id}`
      );
      setResult(response.data);
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorObj.response?.data?.message || "Failed to delete role";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteRole, loading, error, result };
}
