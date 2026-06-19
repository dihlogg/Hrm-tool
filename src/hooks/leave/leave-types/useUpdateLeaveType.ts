"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { LeaveTypeDto } from "./LeaveTypeDto";

export function useUpdateLeaveType() {
  async function updateLeaveType(id: string, leaveType: LeaveTypeDto) {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_LEAVE_REQUEST_TYPE}/${id}`,
        leaveType
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update leave type"
      );
    }
  }

  return { updateLeaveType };
}
