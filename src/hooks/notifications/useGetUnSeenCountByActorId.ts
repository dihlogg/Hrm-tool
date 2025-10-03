import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useEffect, useState, useCallback } from "react";

export function useGetUnSeenCountByActorId(id: string) {
  const [unSeenCount, setUnSeenCount] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUnSeenCount = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GET_UNSEEN_COUNT_BY_ACTOR_ID}/${id}`
      );
      setUnSeenCount(response.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get un seen count");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUnSeenCount();
  }, [fetchUnSeenCount]);

  return { unSeenCount, error, loading, refetchUnSeenCount: fetchUnSeenCount };
}