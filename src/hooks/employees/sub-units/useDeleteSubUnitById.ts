"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useDeleteSubUnitById() {
  async function deleteSubUnit(id: string) {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_SUB_UNIT_BY_ID}/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete sub unit"
      );
    }
  }

  return { deleteSubUnit };
}
