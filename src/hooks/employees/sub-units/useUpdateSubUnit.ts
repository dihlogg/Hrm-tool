"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { SubUnitDto } from "./SubUnitDto";

export function useUpdateSubUnit() {
  async function updateSubUnit(id: string, subUnit: SubUnitDto) {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_SUB_UNIT}/${id}`,
        subUnit
      );
      return response.data;
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message || "Failed to update sub unit"
      );
    }
  }

  return { updateSubUnit };
}
