"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

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
        const data = await fetchWithAuth(API_ENDPOINTS.GET_ALL_JOB_TITLES);
        setJobTitles(data);
      } catch (err: any) {
        setError(err.message || "Failed to load job titles");
      }
    }

    loadJobTitles();
  }, []);

  return { jobTitles, error };
}
