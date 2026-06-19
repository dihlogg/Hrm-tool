"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteJobTitleById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

  const deleteJobTitle = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_JOB_TITLE_BY_ID}/${id}`
      );
      setResult(response.data);
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorObj.response?.data?.message || errorObj.message || "Failed to delete job title";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteJobTitle, loading, error, result };
}
