"use client";

import { useEffect, useState } from "react";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useGetSupervisorEmployee(id: string) {
  const [supervisorEmployee, setSupervisorEmployee] = useState<
    CreateEmployeeDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const getEmployee = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_SUPERVISOR_EMPLOYEE}/${id}`
        );
        setSupervisorEmployee(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to get supervisor employee"
        );
      } finally {
        setLoading(false);
      }
    };
    getEmployee();
  }, [id]);
  return { supervisorEmployee, loading, error };
}
