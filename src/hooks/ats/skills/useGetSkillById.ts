"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { SkillDto } from "./SkillDto";

export function useGetSkillById(id: string | null) {
  const [skill, setSkill] = useState<SkillDto | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadSkill() {
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_SKILL_BY_ID}/${id}`
        );
        setSkill(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load skill");
      }
    }

    loadSkill();
  }, [id]);

  return { skill, error };
}
