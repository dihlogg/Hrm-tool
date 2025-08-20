"use client";

import { useEffect, useState } from "react";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useGetEmployeeBySubUnit(subUnitId: string, employeeId: string) {
  const [subUnitEmployees, setSubUnitEmployees] = useState<CreateEmployeeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subUnitId || !employeeId) return;
    const getEmployee = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_EMPLOYEE_BY_SUB_UNIT}/${subUnitId}/exclude/${employeeId}`
        );
        setSubUnitEmployees(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to get employee by sub unit"
        );
      } finally {
        setLoading(false);
      }
    };
    getEmployee();
  }, [subUnitId, employeeId]);
  return { subUnitEmployees, loading, error };
}
