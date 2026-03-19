"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { PostDto } from "./PostDto";

export function useGetPostById(id: string | undefined, hotReload: number = 0) {
  const [post, setPost] = useState<PostDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_POST_BY_ID}/${id}`,
        );
        setPost(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch post details");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, hotReload]);

  return { post, loading, error };
}
