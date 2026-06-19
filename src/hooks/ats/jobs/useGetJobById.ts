"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { JobDto } from "./JobDto";

export function useGetJobById(id: string | undefined, hotReload: number = 0) {
  const [job, setJob] = useState<JobDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadJobById = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_JOB_BY_ID}/${id}`,
        );
        setJob(response.data);
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    loadJobById();
  }, [id, hotReload]);

  return { job, loading, error };
}
