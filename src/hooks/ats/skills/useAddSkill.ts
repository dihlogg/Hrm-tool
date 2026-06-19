"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { SkillDto } from "./SkillDto";

export function useAddSkill() {
  async function addSkill(skill: SkillDto) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_SKILL,
        skill
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        errorObj.response?.data?.message || errorObj.message || "Failed to add skill"
      );
    }
  }

  return { addSkill };
}
