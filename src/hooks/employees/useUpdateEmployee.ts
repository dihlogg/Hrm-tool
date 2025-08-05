import { useState } from "react";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useUpdateEmployee() {
  const [loading, setLoading] = useState(false);

  const updateEmployee = async (id: string, data: CreateEmployeeDto) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_EMPLOYEE}/${id}`,
        data
      );
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return { updateEmployee, loading };
}
