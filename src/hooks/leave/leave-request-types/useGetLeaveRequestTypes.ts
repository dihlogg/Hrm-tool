"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export interface LeaveRequestType {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export function useGetLeaveRequestType() {
  const [leaveRequestTypes, setLeaveRequestTypes] = useState<LeaveRequestType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaveRequestType() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_LEAVE_REQUEST_TYPE
        );
        setLeaveRequestTypes(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load leave request type");
      }
    }

    loadLeaveRequestType();
  }, []);

  return { leaveRequestTypes, error };
}
