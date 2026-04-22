"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination/offset-pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { ApplicationDto } from "./ApplicationDto";

export function useGetRankedCandidates(
  jobId: string,
  page: number,
  pageSize: number,
  status?: string,
  minScore?: number,
  hotReload: number = 0,
) {
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    async function fetchCandidates() {
      setLoading(true);
      try {
        const params: any = { page, pageSize };
        if (status && status !== "ALL") params.status = status;
        if (minScore !== undefined) params.minScore = minScore;

        const response = await axiosInstance.get<
          PaginatedResponse<ApplicationDto>
        >(`${API_ENDPOINTS.GET_RANKED_CANDIDATES}/${jobId}/ranked`, { params });

        setApplications(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load candidates");
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, [jobId, page, pageSize, status, minScore, hotReload]);

  return { applications, total, error, loading };
}
