"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import axios from "axios";

export interface ApplyJobPayload {
  jobId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileUrl?: string;
  coverLetter?: string;
}

export function useApplyJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyForJob = async (file: File, payload: ApplyJobPayload) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Lấy Presigned URL từ Backend
      const presignedRes = await axiosInstance.get(
        `${API_ENDPOINTS.GET_PRESIGNED_URL}?fileName=${encodeURIComponent(
          file.name,
        )}&contentType=${encodeURIComponent(file.type)}`,
      );
      const { url, storageKey } = presignedRes.data;

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const applyRes = await axiosInstance.post(API_ENDPOINTS.APPLY_JOB, {
        ...payload,
        storageKey,
      });

      return applyRes.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const errMsg =
        errorObj.response?.data?.message || errorObj.message || "Failed to apply for job";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { applyForJob, loading, error };
}
