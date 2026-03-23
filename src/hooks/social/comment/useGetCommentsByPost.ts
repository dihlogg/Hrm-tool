"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CommentDto } from "./CommentDto";

export function useGetCommentsByPost(
  postId: string | undefined,
  page: number = 1,
  pageSize: number = 10,
  hotReload: number = 0,
) {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    async function loadComments() {
      setLoading(true);
      const params = { page, pageSize };

      try {
        const response = await axiosInstance.get<PaginatedResponse<CommentDto>>(
          `${API_ENDPOINTS.GET_COMMENTS_BY_POST}/${postId}`,
          { params },
        );

        setComments(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load comments for post");
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [postId, page, pageSize, hotReload]);

  return { comments, total, error, loading, hotReload };
}
