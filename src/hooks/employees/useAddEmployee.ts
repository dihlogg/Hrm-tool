"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useAddEmployee() {
  async function addEmployee(employee: CreateEmployeeDto) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_EMPLOYEE,
        employee
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        errorObj.response?.data?.message || "Failed to add employee"
      );
    }
  }

  return { addEmployee };
}
