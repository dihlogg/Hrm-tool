"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export interface CreateUserRoleDto {
  userId: string;
  roleId: string;
}

export function useAssignRoleToUser() {
  const [loading, setLoading] = useState(false);

  async function assignRoleToUser(data: CreateUserRoleDto) {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ASSIGN_ROLE_TO_USER,
        data,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to assign role to user",
      );
    } finally {
      setLoading(false);
    }
  }

  return { assignRoleToUser, loading };
}
