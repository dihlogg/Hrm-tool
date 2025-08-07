import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function usePatchEmployeeStatus() {
  const [loading, setLoading] = useState(false);

  const updateEmployeeStatus = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.PATCH_EMPLOYEE_STATUS}/${id}`
      );
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return { updateEmployeeStatus, loading };
}
