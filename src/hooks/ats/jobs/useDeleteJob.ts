"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteJob = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_JOB}/${id}`,
      );
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to delete job";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteJob, loading, error };
}
