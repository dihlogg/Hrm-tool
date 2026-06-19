"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { LeaveTypeDto } from "./LeaveTypeDto";

export function useAddLeaveType() {
  async function addLeaveType(leaveType: LeaveTypeDto) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_LEAVE_REQUEST_TYPE,
        leaveType
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to add leave type"
      );
    }
  }

  return { addLeaveType };
}
