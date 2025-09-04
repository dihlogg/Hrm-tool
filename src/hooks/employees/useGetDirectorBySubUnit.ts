"use client";

import { useEffect, useState } from "react";
import { CreateEmployeeDto } from "./CreateEmployeeDto";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useGetDirectorBySubUnit(id: string) {
  const [director, setDirector] = useState<CreateEmployeeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const getDirector = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_DIRECTOR_BY_SUB_UNIT}/${id}`
        );
        setDirector(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to get director");
      } finally {
        setLoading(false);
      }
    };
    getDirector();
  }, [id]);
  return { director, loading, error };
}
