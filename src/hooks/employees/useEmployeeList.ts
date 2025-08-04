"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/axiosInstance";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import { PaginatedResponse } from "@/types/pagination";

export function useEmployeeList(
  page: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "ASC" | "DESC" | undefined
) {
  const [sortedEmployees, setSortedEmployees] = useState<CreateEmployeeDto[]>(
    []
  );
  const [sortedTotal, setSortedTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sortBy || !sortOrder) return;
    async function loadEmployee() {
      setLoading(true);
      try {
        const response = await axiosInstance.get<
          PaginatedResponse<CreateEmployeeDto>
        >(API_ENDPOINTS.GET_EMPLOYEE_LIST, {
          params: {
            page,
            pageSize,
            sortBy,
            sortOrder,
          },
        });
        setSortedEmployees(response.data.data);
        setSortedTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [page, pageSize, sortBy, sortOrder]);

  return { sortedEmployees, sortedTotal, error, loading };
}
