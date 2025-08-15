"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateEmployeeDto } from "./CreateEmployeeDto";

export function useGetAllEmployees() {
  const [employees, setEmployees] = useState<CreateEmployeeDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_EMPLOYEES
        );
        setEmployees(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      }
    }

    loadEmployees();
  }, []);

  return { employees, error };
}
