import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useEffect, useState } from "react";

export function useGetUnReadCountByActorId(id: string) {
  const [unReadCount, setUnReadCount] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadUnReadCount = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_UNREAD_COUNT_BY_ACTOR_ID}/${id}`
        );
        setUnReadCount(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to get un read count");
      } finally {
        setLoading(false);
      }
    };
    loadUnReadCount();
  }, [id]);
  return { unReadCount, error, loading };
}
