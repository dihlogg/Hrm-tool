"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export interface UserStatuses {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export function useUserStatuses() {
  const [userStatuses, setUserStatuses] = useState<UserStatuses[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUserStatuses() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_USER_STAUSES
        );
        setUserStatuses(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load user statuses");
      }
    }

    loadUserStatuses();
  }, []);

  return { userStatuses, error };
}
