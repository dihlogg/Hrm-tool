"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { ToggleReactionDto } from "./ReactionDto";

export function useToggleReaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleReaction(data: ToggleReactionDto) {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.TOGGLE_REACTION,
        data,
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const errMsg = errorObj.response?.data?.message || "Failed to toggle reaction";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return { toggleReaction, loading, error };
}
