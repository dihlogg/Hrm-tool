"use client";

import { useState } from "react";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useCreateUserAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserAccount = async (employeeId: string, payload: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.CREATE_USER_ACCOUNT}/${employeeId}`,
        payload
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        errorObj.response?.data?.message || errorObj.message || "Failed to create user account";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createUserAccount, loading, error };
}
