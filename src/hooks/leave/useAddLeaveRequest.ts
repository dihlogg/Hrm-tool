"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateLeaveRequestDto } from "./CreateLeaveRequestDto";

export function useAddLeaveRequest() {
  async function addLeaveRequest(leaveRequest: CreateLeaveRequestDto) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_LEAVE_REQUEST,
        leaveRequest
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        errorObj.response?.data?.message || "Failed to create new leave request"
      );
    }
  }

  return { addLeaveRequest };
}
