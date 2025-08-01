"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import axiosInstance from "@/utils/axiosInstance";

export function useAddEmployee() {
  async function addEmployee(employee: CreateEmployeeDto) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_EMPLOYEE,
        employee
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to add employee"
      );
    }
  }

  return { addEmployee };
}
