"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export interface LeaveReasons {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export function useGetLeaveReason() {
  const [leaveReasons, setLeaveReasons] = useState<LeaveReasons[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaveReason() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_LEAVE_REASON
        );
        setLeaveReasons(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load leave reason");
      }
    }

    loadLeaveReason();
  }, []);

  return { leaveReasons, error };
}
