"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateJobTitleDto } from "./CreateJobTitleDto";

export function useJobTitles(hotReload: number = 0) {
  const [jobTitles, setJobTitles] = useState<CreateJobTitleDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobTitles() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_JOB_TITLES
        );
        setJobTitles(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load job titles");
      }
    }

    loadJobTitles();
  }, [hotReload]);

  return { jobTitles, error, hotReload };
}
