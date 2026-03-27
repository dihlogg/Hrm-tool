import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateRoleDto } from "./CreateRoleDto";

export function useUpdateRole() {
  const [loading, setLoading] = useState(false);

  const updateRole = async (id: string, data: CreateRoleDto) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_ROLE}/${id}`,
        data,
      );
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return { updateRole, loading };
}
