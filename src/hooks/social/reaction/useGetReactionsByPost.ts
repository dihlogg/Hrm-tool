"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination/offset-pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { ReactionDto } from "./ReactionDto";

export function useGetReactionsByPost(
  postId: string | undefined,
  page: number = 1,
  pageSize: number = 10,
  hotReload: number = 0,
) {
  const [reactions, setReactions] = useState<ReactionDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    async function loadReactions() {
      setLoading(true);
      const params = { page, pageSize };

      try {
        const response = await axiosInstance.get<
          PaginatedResponse<ReactionDto>
        >(`${API_ENDPOINTS.GET_REACTIONS_BY_POST}/${postId}`, { params });

        setReactions(response.data.data);
        setTotal(response.data.total);
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.message || "Failed to load reactions for post");
      } finally {
        setLoading(false);
      }
    }

    loadReactions();
  }, [postId, page, pageSize, hotReload]);

  return { reactions, total, error, loading, hotReload };
}
