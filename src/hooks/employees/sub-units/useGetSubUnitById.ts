"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { SubUnitDto } from "./SubUnitDto";

export function useGetSubUnitById(id: string | null) {
  const [subUnit, setSubUnit] = useState<SubUnitDto | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadSubUnit() {
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_SUB_UNIT_BY_ID}/${id}`
        );
        setSubUnit(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load sub unit");
      }
    }

    loadSubUnit();
  }, [id]);

  return { subUnit, error };
}
