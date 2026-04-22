"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

export function useGetCvDownloadUrl() {
  const [loading, setLoading] = useState(false);

  const openCv = async (storageKey: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${API_ENDPOINTS.GET_CV_DOWNLOAD_URL}?storageKey=${encodeURIComponent(storageKey)}`,
      );
      const url: string = res.data?.url ?? res.data;
      window.open(url, "_blank", "noreferrer");
    } finally {
      setLoading(false);
    }
  };

  return { openCv, loading };
}
