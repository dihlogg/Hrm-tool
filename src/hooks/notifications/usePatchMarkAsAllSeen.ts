import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useState } from "react";

export function usePatchMarkAsAllSeen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const markAsAllSeen = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.PATCH_MARK_AS_ALL_SEEN}/${id}`
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to mark as all seen");
    } finally {
      setLoading(false);
    }
  };
  return { markAsAllSeen, loading, error };
}
