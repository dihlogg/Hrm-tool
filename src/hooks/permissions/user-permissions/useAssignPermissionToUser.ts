"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateUserPermissionDto } from "../PermissionDto";

export function useAssignPermissionToUser() {
  const [loading, setLoading] = useState(false);

  async function assignUserPermission(data: CreateUserPermissionDto) {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ASSIGN_PERMISSION_TO_USER,
        data,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to assign permission to user",
      );
    } finally {
      setLoading(false);
    }
  }

  return { assignUserPermission, loading };
}
