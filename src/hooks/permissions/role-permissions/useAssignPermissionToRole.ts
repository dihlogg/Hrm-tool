"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateRolePermissionDto } from "../PermissionDto";

export function useAssignPermissionToRole() {
  const [loading, setLoading] = useState(false);

  async function assignPermission(data: CreateRolePermissionDto) {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ASSIGN_PERMISSION_TO_ROLE,
        data,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to assign permission to role",
      );
    } finally {
      setLoading(false);
    }
  }

  return { assignPermission, loading };
}
