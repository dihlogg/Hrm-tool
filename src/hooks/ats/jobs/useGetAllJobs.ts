"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { JobDto } from "./JobDto";

export function useGetAllJobs(hotReload: number = 0) {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_JOBS);
        setJobs(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [hotReload]);

  return { jobs, error, loading, hotReload };
}
