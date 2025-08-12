"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export interface LeaveStatuses {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export function useGetLeaveStatus() {
  const [leaveStatuses, setLeaveStatuses] = useState<LeaveStatuses[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaveStatus() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_LEAVE_STATUS
        );
        setLeaveStatuses(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load leave status");
      }
    }

    loadLeaveStatus();
  }, []);

  return { leaveStatuses, error };
}
