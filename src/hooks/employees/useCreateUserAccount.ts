"use client";

import { useState } from "react";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useCreateUserAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserAccount = async (employeeId: string, payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.CREATE_USER_ACCOUNT}/${employeeId}`,
        payload
      );
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create user account";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createUserAccount, loading, error };
}
