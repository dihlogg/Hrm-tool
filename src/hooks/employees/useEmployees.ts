"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import { PaginatedResponse } from "@/types/pagination";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useEmployees(
  page: number,
  pageSize: number,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC"
) {
  const [employees, setEmployees] = useState<CreateEmployeeDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEmployees() {
      setLoading(true);
      const params: any = {
        page,
        pageSize,
      };

      if (sortBy && sortOrder) {
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }
      try {
        const response = await axiosInstance.get<
          PaginatedResponse<CreateEmployeeDto>
        >(API_ENDPOINTS.GET_EMPLOYEE_LIST, { params });

        setEmployees(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, [page, pageSize, sortBy, sortOrder]);

  return { employees, total, error, loading };
}
