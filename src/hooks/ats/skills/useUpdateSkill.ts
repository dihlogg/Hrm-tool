"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { SkillDto } from "./SkillDto";

export function useUpdateSkill() {
  async function updateSkill(id: string, skill: SkillDto) {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_SKILL}/${id}`,
        skill
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        errorObj.response?.data?.message || errorObj.message || "Failed to update skill"
      );
    }
  }

  return { updateSkill };
}
