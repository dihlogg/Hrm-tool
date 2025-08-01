"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/axiosInstance";
import { CreateEmployeeDto } from "./CreateEmployeeDto";

export function useGetEmployees() {
  const [employee, setEmployee] = useState<CreateEmployeeDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_EMPLOYEES);
        setEmployee(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      }
    }

    loadEmployee();
  }, []);

  return { employee, error };
}

