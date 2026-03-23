"use client";

import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_COMMENT}/${id}`,
      );
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to delete comment";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteComment, loading, error };
}
