"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/axiosInstance";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import { PaginatedResponse } from "@/types/pagination";

export function useGetEmployees(page: number, pageSize: number) {
  const [employee, setEmployee] = useState<CreateEmployeeDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        const response = await axiosInstance.get<
          PaginatedResponse<CreateEmployeeDto>
        >(
          `${API_ENDPOINTS.GET_ALL_EMPLOYEES}?page=${page}&pageSize=${pageSize}`
        );
        setEmployee(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      }
    }

    loadEmployee();
  }, [page, pageSize]);

  return { employee, total, error };
}
