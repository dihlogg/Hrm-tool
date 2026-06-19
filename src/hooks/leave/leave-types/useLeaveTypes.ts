"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { LeaveTypeDto } from "./LeaveTypeDto";

export function useLeaveTypes(hotReload: number = 0) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaveTypes() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_LEAVE_REQUEST_TYPE
        );
        setLeaveTypes(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load leave types");
      }
    }

    loadLeaveTypes();
  }, [hotReload]);

  return { leaveTypes, error, hotReload };
}
