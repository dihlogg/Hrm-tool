"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/axiosInstance";

export interface JobTitles {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export function useJobTitles() {
  const [jobTitles, setJobTitles] = useState<JobTitles[]>([]);
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
  }, []);

  return { jobTitles, error };
}
