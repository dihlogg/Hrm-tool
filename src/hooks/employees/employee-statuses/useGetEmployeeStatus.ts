"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export interface EmployeeStatuses {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export function useGetEmployeeStatus() {
  const [employeeStatuses, setEmployeeStatuses] = useState<EmployeeStatuses[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployeeStatus() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_EMPLOYEE_STATUSES
        );
        setEmployeeStatuses(response.data);
      } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
        setError(err.message || "Failed to load employee status");
      }
    }

    loadEmployeeStatus();
  }, []);

  return { employeeStatuses, error };
}
