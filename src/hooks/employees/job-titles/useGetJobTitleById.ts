"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateJobTitleDto } from "./CreateJobTitleDto";

export function useGetJobTitleById(id: string | undefined) {
  const [jobTitles, setJobTitles] = useState<CreateJobTitleDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadJobTitleById = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_JOB_TITLE_BY_ID}/${id}`
        );
        setJobTitles(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load job title");
      } finally {
        setLoading(false);
      }
    };

    loadJobTitleById();
  }, [id]);

  return { jobTitles, loading, error };
}
