"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteLeaveTypeById() {
  async function deleteLeaveType(id: string) {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_LEAVE_REQUEST_TYPE}/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete leave type"
      );
    }
  }

  return { deleteLeaveType };
}
