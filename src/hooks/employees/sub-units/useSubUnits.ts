"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export interface SubUnits {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export function useSubUnits(hotReload: number = 0) {
  const [subUnits, setSubUnits] = useState<SubUnits[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubUnits() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_SUB_UNITS
        );
        setSubUnits(response.data);
      } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
        setError(err.message || "Failed to load sub units");
      }
    }

    loadSubUnits();
  }, [hotReload]);

  return { subUnits, error, hotReload };
}
