"use client";

import { useEffect, useState } from "react";
import { LeaveRequestFilters } from "./LeaveRequestFilterDto";
import { LeaveRequestDto } from "./LeaveRequestDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { PaginatedResponse } from "@/types/pagination";
import { API_ENDPOINTS } from "@/services/apiService";

export function useGetLeaveRequestForDirector(
  directorId: string,
  page: number,
  pageSize: number,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  filters: LeaveRequestFilters = {},
  hotReload: number = 0
) {
  const [leaveRequests, setleaveRequests] = useState<
    LeaveRequestDto[]
  >([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!directorId) return;
    async function loadLeaveRequestForDirectorId(directorId: string) {
      setLoading(true);

      const cleanedFilters: Record<string, string> = Object.fromEntries(
        Object.entries(filters)
          .filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== ""
          )
          .map(([key, value]) => [
            key,
            value instanceof Date ? value.toISOString() : value,
          ])
      );

      const params: any = {
        page,
        pageSize,
        ...cleanedFilters,
      };

      if (sortBy && sortOrder) {
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }

      try {
        const response = await axiosInstance.get<
          PaginatedResponse<LeaveRequestDto>
        >(`${API_ENDPOINTS.GET_LEAVE_REQUEST_FOR_DIRECTOR}/${directorId}`, {
          params,
        });
        setleaveRequests(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to get leave request for director"
        );
      } finally {
        setLoading(false);
      }
    }
    loadLeaveRequestForDirectorId(directorId);
  }, [
    directorId,
    page,
    pageSize,
    sortBy,
    sortOrder,
    JSON.stringify(filters),
    hotReload,
  ]);

  return { leaveRequests, total, loading, error };
}
