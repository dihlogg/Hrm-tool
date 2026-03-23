"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination/offset-pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CommentDto } from "./CommentDto";

export function useGetReplies(
  commentId: string | undefined | null,
  page: number = 1,
  pageSize: number = 10,
  hotReload: number = 0,
) {
  const [replies, setReplies] = useState<CommentDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!commentId) return;

    async function loadReplies() {
      setLoading(true);
      const params = { page, pageSize };

      try {
        const response = await axiosInstance.get<PaginatedResponse<CommentDto>>(
          `${API_ENDPOINTS.GET_REPLIES_BY_COMMENT}/${commentId}`,
          { params },
        );

        if (page === 1) {
          setReplies(response.data.data);
        } else {
          setReplies((prev) => [...prev, ...response.data.data]);
        }
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load replies");
      } finally {
        setLoading(false);
      }
    }

    loadReplies();
  }, [commentId, page, pageSize, hotReload]);

  return { replies, total, error, loading, hotReload };
}
