"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { UpdatePostDto } from "./UpdatePostDto";

export function useUpdatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePost = async (id: string, data: UpdatePostDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.UPDATE_POST}/${id}`,
        data
      );
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update post";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { updatePost, loading, error };
}