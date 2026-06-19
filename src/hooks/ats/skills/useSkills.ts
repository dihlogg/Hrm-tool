"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { SkillDto } from "./SkillDto";

export function useSkills(hotReload: number = 0) {
  const [skills, setSkills] = useState<SkillDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkills() {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.GET_ALL_SKILLS
        );
        setSkills(response.data);
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load skills");
      }
    }

    loadSkills();
  }, [hotReload]);

  return { skills, error, hotReload };
}
