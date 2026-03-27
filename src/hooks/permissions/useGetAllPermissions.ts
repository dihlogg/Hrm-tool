"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { useEffect, useState } from "react";
import { PermissionDto } from "./PermissionDto";

export function useGetAllPermissions(hotReload: number = 0) {
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAllPermissions() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_PERMISSIONS,
        );
        setPermissions(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load permissions",
        );
      } finally {
        setLoading(false);
      }
    }
    loadAllPermissions();
  }, [hotReload]);

  return { permissions, error, loading };
}
