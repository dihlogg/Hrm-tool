"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination/offset-pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { LeaveRequestDto } from "./LeaveRequestDto";

export function useGetReceiveRequests(employeeId: string, page: number = 1, pageSize: number = 5) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    async function loadRequests(employeeId: string) {
      setLoading(true);

      const params: any = {
        page,
        pageSize,
      };

      try {
        const response = await axiosInstance.get<
          PaginatedResponse<LeaveRequestDto>
        >(`${API_ENDPOINTS.GET_RECEIVE_REQUESTS}/${employeeId}`, {
          params,
        });

        setLeaveRequests(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load receive requests");
      } finally {
        setLoading(false);
      }
    }

    loadRequests(employeeId);
  }, [employeeId, page, pageSize]);

  return { employeeId, leaveRequests, total, error, loading };
}
