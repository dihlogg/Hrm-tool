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
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to add skill"
      );
    }
  }

  return { addSkill };
}
