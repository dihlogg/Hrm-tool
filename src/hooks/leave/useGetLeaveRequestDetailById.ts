import { useEffect, useState } from "react";
import { LeaveRequestDto } from "./LeaveRequestDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useGetleaveRequestDetailById(id: string | undefined) {
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequestDto | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchLeaveRequest = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_LEAVE_REQUEST_DETAIL_BY_ID}/${id}`
        );
        setLeaveRequest(response.data);
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(
          errorObj.response?.data?.message || "Failed to fetch leave request"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveRequest();
  }, [id]);
  return { leaveRequest, loading, error };
}
