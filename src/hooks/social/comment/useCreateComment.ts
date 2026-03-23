"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateCommentDto } from "./CommentDto";

export function useCreateComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createComment(data: CreateCommentDto) {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_COMMENT,
        data,
      );
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to create comment";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return { createComment, loading, error };
}
