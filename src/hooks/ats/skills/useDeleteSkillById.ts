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
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        errorObj.response?.data?.message || errorObj.message || "Failed to delete skill"
      );
    }
  }

  return { deleteSkill };
}
