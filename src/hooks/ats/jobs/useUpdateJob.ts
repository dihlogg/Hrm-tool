"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateJobDto } from "./JobDto";

export function useUpdateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateJob = async (id: string, data: CreateJobDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_JOB}/${id}`,
        data,
      );
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update job";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { updateJob, loading, error };
}
