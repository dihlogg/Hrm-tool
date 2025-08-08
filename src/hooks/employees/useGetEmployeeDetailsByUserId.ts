"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useGetEmployeeDetailsByUserId(id: string | undefined) {
  const [employee, setEmployee] = useState<CreateEmployeeDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_EMPLOYEE_DETAILS_BY_USER_ID}/${id}`
        );
        setEmployee(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return { employee, loading, error };
}
