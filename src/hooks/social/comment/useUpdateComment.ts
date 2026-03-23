"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { UpdateCommentDto } from "./CommentDto";

export function useUpdateComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateComment = async (id: string, data: UpdateCommentDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.UPDATE_COMMENT}/${id}`,
        data,
      );
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update comment";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { updateComment, loading, error };
}
