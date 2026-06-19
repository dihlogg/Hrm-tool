"use client";

import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateJobTitleDto } from "./CreateJobTitleDto";

export function useAddJobTitle() {
  async function addJobTitle(jobTitle: CreateJobTitleDto) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST_JOB_TITLE,
        jobTitle
      );
      return response.data;
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message || "Failed to add job title"
      );
    }
  }

  return { addJobTitle };
}
