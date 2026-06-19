"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { RoleDto } from "./CreateRoleDto";

export function useGetRoleById(id: string | undefined) {
  const [role, setRole] = useState<RoleDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadRoleById = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_ROLE_BY_ID}/${id}`
        );
        setRole(response.data);
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.response?.data?.message || "Failed to load role");
      } finally {
        setLoading(false);
      }
    };

    loadRoleById();
  }, [id]);

  return { role, loading, error };
}
