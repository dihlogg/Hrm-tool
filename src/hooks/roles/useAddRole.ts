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
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to add role",
      );
    }
  }

  return { addRole };
}
