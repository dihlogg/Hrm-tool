"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { CreateEmployeeDto } from "./CreateEmployeeDto";

export function useAddEmployee() {
  async function addEmployee(employee: CreateEmployeeDto) {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.POST_EMPLOYEE, {
        method: "POST",
        body: JSON.stringify(employee),
      });

      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to add employee");
    }
  }

  return { addEmployee };
}
