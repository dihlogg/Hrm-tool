"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { LeaveRequestFilters } from "./LeaveRequestFilterDto";
import { LeaveRequestDto } from "./LeaveRequestDto";

export function useGetLeaveRequestForSupervisor(
  supervisorId: string,
  page: number,
  pageSize: number,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  filters: LeaveRequestFilters = {},
  hotReload: number = 0
) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supervisorId) return;
    async function loadLeaveRequestForSupervisorId(supervisorId: string) {
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
        >(`${API_ENDPOINTS.GET_LEAVE_REQUEST_FOR_SUPERVISOR}/${supervisorId}`, {
          params,
        });

        setLeaveRequests(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load leave requests for supervisor");
      } finally {
        setLoading(false);
      }
    }

    loadLeaveRequestForSupervisorId(supervisorId);
  }, [
    supervisorId,
    page,
    pageSize,
    sortBy,
    sortOrder,
    JSON.stringify(filters),
    hotReload,
  ]);

  return { supervisorId, leaveRequests, total, error, loading, hotReload };
}
