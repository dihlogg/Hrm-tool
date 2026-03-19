"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreatePostDto } from "./CreatePostDto";
import { useState } from "react";

export function useAddPost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addPost(data: CreatePostDto) {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_POST,
        data,
      );
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to create post";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return { addPost, loading, error };
}
