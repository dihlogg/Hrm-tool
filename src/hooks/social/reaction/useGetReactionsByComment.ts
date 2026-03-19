"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { ReactionDto } from "./ReactionDto";

export function useGetReactionsByComment(
  commentId: string | undefined,
  page: number = 1,
  pageSize: number = 10,
  hotReload: number = 0,
) {
  const [reactions, setReactions] = useState<ReactionDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!commentId) return;

    async function loadReactions() {
      setLoading(true);
      const params = { page, pageSize };

      try {
        const response = await axiosInstance.get<
          PaginatedResponse<ReactionDto>
        >(`${API_ENDPOINTS.GET_REACTIONS_BY_COMMENT}/${commentId}`, { params });

        setReactions(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load reactions for comment");
      } finally {
        setLoading(false);
      }
    }

    loadReactions();
  }, [commentId, page, pageSize, hotReload]);

  return { reactions, total, error, loading, hotReload };
}
