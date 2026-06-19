import { useState } from "react";
import { CreateLeaveRequestDto } from "./CreateLeaveRequestDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useUpdateLeaveRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const updateLeaveRequest = async (
    id: string,
    data: CreateLeaveRequestDto
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_LEAVE_REQUEST}/${id}`,
        data
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        errorObj.response?.data?.message || "Failed to update this leave request"
      );
    } finally {
      setLoading(false);
    }
  };
  return { updateLeaveRequest, loading, error };
}
