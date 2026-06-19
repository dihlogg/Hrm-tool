"use client";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useEffect, useState } from "react";
import { RoleDto } from "./CreateRoleDto";

export function useGetAllRoles(hotReload?: number) {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAllRoles() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_ROLES);
        setRoles(response.data);
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    }
    loadAllRoles();
  }, [hotReload]);

  return { roles, error, loading };
}
