"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { LeaveRequestFilters } from "./LeaveRequestFilterDto";
import { CreateLeaveRequestDto } from "./CreateLeaveRequestDto";
import { LeaveRequestDto } from "./LeaveRequestDto";

export function useGetLeaveRequestByEmployeeId(
  employeeId: string,
  page: number,
  pageSize: number,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  filters: LeaveRequestFilters = {},
  hotReload: number = 0
) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestDto[]>(
    []
  );
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    async function loadLeaveRequestByEmployeeId(employeeId: string) {
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
        >(`${API_ENDPOINTS.GET_LEAVE_REQUEST_BY_EMPLOYEE_ID}/${employeeId}`, {
          params,
        });

        setLeaveRequests(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    }

    loadLeaveRequestByEmployeeId(employeeId);
  }, [
    employeeId,
    page,
    pageSize,
    sortBy,
    sortOrder,
    JSON.stringify(filters),
    hotReload,
  ]);

  return { employeeId, leaveRequests, total, error, loading, hotReload };
}
