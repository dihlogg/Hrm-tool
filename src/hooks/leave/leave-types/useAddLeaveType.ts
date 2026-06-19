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
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        errorObj.response?.data?.message || "Failed to add leave type"
      );
    }
  }

  return { addLeaveType };
}
