"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateRoleDto } from "./CreateRoleDto";

export function useAddRole() {
  async function addRole(role: CreateRoleDto) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_NEW_ROLE,
        role,
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        errorObj.response?.data?.message || errorObj.message || "Failed to add role",
      );
    }
  }

  return { addRole };
}
