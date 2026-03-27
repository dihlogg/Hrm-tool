"use client";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useEffect, useState } from "react";
import { RoleDto } from "./CreateRoleDto";

export function useGetAllRoles(hotReload?: number) {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAllRoles() {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_ROLES);
        setRoles(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load roles");
      }
    }
    loadAllRoles();
  }, [hotReload]);
  return { roles, error };
}
