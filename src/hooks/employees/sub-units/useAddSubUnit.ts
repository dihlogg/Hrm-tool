"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { SubUnitDto } from "./SubUnitDto";

export function useAddSubUnit() {
  async function addSubUnit(subUnit: SubUnitDto) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_SUB_UNIT,
        subUnit
      );
      return response.data;
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message || "Failed to add sub unit"
      );
    }
  }

  return { addSubUnit };
}
