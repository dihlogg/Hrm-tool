"use client";

import { useEffect, useState } from "react";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiService";

export function useGetParentForEmployee() {
  const [parentEmployee, setParentEmployee] = useState<CreateEmployeeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployeeForParent() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_PARENT_FOR_EMPLOYEE
        );
        setParentEmployee(response.data);
      } catch (err: any) {
        setError(err.message || "failed to load parent for employee");
      } finally {
        setLoading(false);
      }
    }
    loadEmployeeForParent();
  }, []);
  return { parentEmployee, loading, error };
}
