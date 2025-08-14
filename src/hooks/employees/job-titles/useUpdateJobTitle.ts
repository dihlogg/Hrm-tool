import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { CreateJobTitleDto } from "./CreateJobTitleDto";

export function useUpdateJobTitle() {
  const [loading, setLoading] = useState(false);

  const updateJobTitle = async (id: string, data: CreateJobTitleDto) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.PUT_JOB_TITLE}/${id}`,
        data
      );
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return { updateJobTitle, loading };
}
