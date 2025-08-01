"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { CreateEmployeeDto } from "./CreateEmployeeDto";

export function useGetEmployeeById(id: string | undefined) {
  const [employee, setEmployee] = useState<CreateEmployeeDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth(`${API_ENDPOINTS.GET_EMPLOYEE_BY_ID}/${id}`);
        console.log("Fetched employee:", data);
        setEmployee(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return { employee, loading, error };
}
