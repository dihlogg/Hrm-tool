"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteSkillById() {
  async function deleteSkill(id: string) {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_SKILL}/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete skill"
      );
    }
  }

  return { deleteSkill };
}
