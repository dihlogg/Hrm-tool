import { useState } from "react";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { API_ENDPOINTS } from "@/services/apiService";

export function useUpdateEmployee() {
  const [loading, setLoading] = useState(false);

  const updateEmployee = async (id: string, data: CreateEmployeeDto) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_ENDPOINTS.PUT_EMPLOYEE}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      return response;
    } finally {
      setLoading(false);
    }
  };

  return { updateEmployee, loading };
}
