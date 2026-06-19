"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { ReactionCountDto } from "./ReactionDto";

export function useGetReactionCountByPost(
  postId: string | undefined,
  hotReload: number = 0,
) {
  const [reactionCounts, setReactionCounts] = useState<ReactionCountDto[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    async function loadReactionCounts() {
      setLoading(true);
      try {
        const response = await axiosInstance.get<ReactionCountDto[]>(
          `${API_ENDPOINTS.GET_REACTION_COUNT_BY_POST}/${postId}`,
        );

        setReactionCounts(response.data);
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.message || "Failed to load reaction counts for post");
      } finally {
        setLoading(false);
      }
    }

    loadReactionCounts();
  }, [postId, hotReload]);

  return { reactionCounts, error, loading, hotReload };
}
