"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { LeaveTypeDto } from "./LeaveTypeDto";

export function useGetLeaveTypeById(id: string | null) {
  const [leaveType, setLeaveType] = useState<LeaveTypeDto | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadLeaveType() {
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_LEAVE_REQUEST_TYPE_BY_ID}/${id}`
        );
        setLeaveType(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load leave type");
      }
    }

    loadLeaveType();
  }, [id]);

  return { leaveType, error };
}
