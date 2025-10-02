import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useState } from "react";

export function usePatchMarkAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const markAsRead = async (objectId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.PATCH_MARK_AS_READ}/${objectId}`
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to mark as read");
    } finally {
      setLoading(false);
    }
  };
  return { markAsRead, loading, error };
}
