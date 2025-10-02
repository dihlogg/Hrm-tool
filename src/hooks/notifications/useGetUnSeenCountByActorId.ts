import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useEffect, useState } from "react";

export function useGetUnSeenCountByActorId(id: string) {
  const [unSeenCount, setUnSeenCount] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadUnSeenCount = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_UNSEEN_COUNT_BY_ACTOR_ID}/${id}`
        );
        setUnSeenCount(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to get un seen count");
      } finally {
        setLoading(false);
      }
    };
    loadUnSeenCount();
  }, [id]);
  return { unSeenCount, error, loading };
}
