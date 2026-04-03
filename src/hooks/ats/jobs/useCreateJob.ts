"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateJobDto } from "./JobDto";

export function useCreateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createJob(data: CreateJobDto) {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.POST_JOB, data);
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to create job";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return { createJob, loading, error };
}
