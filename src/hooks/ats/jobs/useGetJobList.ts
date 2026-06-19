"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination/offset-pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { JobDto } from "./JobDto";
import { JobFilters } from "./JobFiltersDto";

export function useGetJobList(
  page: number,
  pageSize: number,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  filters: JobFilters = {},
  hotReload: number = 0,
) {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);

      const cleanedFilters: Record<string, string> = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value && value.trim() !== "",
        ),
      );

      const params: Record<string, string | number> = {
        page,
        pageSize,
        ...cleanedFilters,
      };

      if (sortBy && sortOrder) {
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }

      try {
        const response = await axiosInstance.get<PaginatedResponse<JobDto>>(
          API_ENDPOINTS.GET_JOB_LIST,
          { params },
        );

        setJobs(response.data.data);
        setTotal(response.data.total);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [page, pageSize, sortBy, sortOrder, JSON.stringify(filters), hotReload]);

  return { jobs, total, error, loading, hotReload };
}
