"use client";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useEffect, useState } from "react";

export interface Roles {
  id: string;
  name: string;
  description: string;
  displayOder: number;
}

export function useGetAllRoles() {
  const [roles, setRoles] = useState<Roles[]>([]);
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
  }, []);
  return { roles, error };
}
