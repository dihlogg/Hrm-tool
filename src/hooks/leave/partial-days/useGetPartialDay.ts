"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export interface PartialDays {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export function useGetPartialDay() {
  const [partialDays, setPartialDays] = useState<PartialDays[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPartialDay() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_PARTIAL_DAY
        );
        setPartialDays(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load partial days");
      }
    }

    loadPartialDay();
  }, []);

  return { partialDays, error };
}
