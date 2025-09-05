"use client";

import { useState } from "react";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function usePatchLeaveRequestStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const patchLeaveRequestStatus = async (
    id: string,
    statusCode: string,
    note?: string
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.PATCH_LEAVE_REQUEST_STATUS}/${id}`,
        { statusCode, note }
      );
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to patch leave request status"
      );
    } finally {
      setLoading(false);
    }
  };
  return { patchLeaveRequestStatus, loading, error };
}
