"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { CreateEmployeeDto } from "./CreateEmployeeDto";

export function useEmployee() {
  const [employee, setEmployee] = useState<CreateEmployeeDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        const data = await fetchWithAuth(API_ENDPOINTS.GET_ALL_EMPLOYEES);
        setEmployee(data);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      }
    }

    loadEmployee();
  }, []);

  return { employee, error };
}
