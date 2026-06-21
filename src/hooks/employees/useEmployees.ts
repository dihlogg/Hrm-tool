"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import { PaginatedResponse } from "@/types/pagination/offset-pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { EmployeeFilters } from "./EmployeeFiltersDto";

export function useEmployees(
  page: number,
  pageSize: number,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  filters: EmployeeFilters = {},
  hotReload: number = 0
) {
  const [employees, setEmployees] = useState<CreateEmployeeDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEmployees() {
      setLoading(true);

      const cleanedFilters: Record<string, string> = Object.fromEntries(
        Object.entries(filters).filter(
          (entry) => entry[1] && entry[1].trim() !== ""
        )
      );

      const params: Record<string, string | number> = {
        page,
        pageSize,
        ...cleanedFilters,
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
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortBy, sortOrder, JSON.stringify(filters), hotReload]);

  return { employees, total, error, loading, hotReload };
}
