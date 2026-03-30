"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useGetUserPermissionsByUserId(
  userId: string | null,
  hotReload: number = 0,
) {
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const loadPermissions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_PERMISSIONS_BY_USER_ID}/${userId}`,
        );
        setUserPermissions(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load permissions for this user",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [userId, hotReload]);

  return { userPermissions, loading, error };
}
