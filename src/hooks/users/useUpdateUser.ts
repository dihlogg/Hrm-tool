"use client"

import { useState } from "react";
import { UserDto } from "./UserDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const updateUser = async (id: string, data: UserDto) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_USER}/${id}`,
        data
      );
      return response.data;
    } catch (err: any) {
      setError(
        err.response.data.message || "Failed to update user information"
      );
    } finally {
      setLoading(false);
    }
  };
  return { updateUser, loading, error };
}
