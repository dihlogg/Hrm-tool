"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { UpdateUserPermissionDto } from "../PermissionDto";

export function useChangeUserPermissionStatus() {
  const [loading, setLoading] = useState(false);

  const changeStatus = async (
    userPermissionId: string,
    data: UpdateUserPermissionDto,
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.CHANGE_USER_PERMISSION_STATUS}/${userPermissionId}`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        errorObj.response?.data?.message || "Failed to change permission status",
      );
    } finally {
      setLoading(false);
    }
  };

  return { changeStatus, loading };
}
