"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination/offset-pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { PostDto } from "./PostDto";

export function useGetPostsByEmployee(
  employeeId: string | undefined,
  page: number,
  pageSize: number,
  hotReload: number = 0,
) {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!employeeId) return;

    async function loadEmployeePosts() {
      setLoading(true);
      const params = { page, pageSize };

      try {
        const response = await axiosInstance.get<PaginatedResponse<PostDto>>(
          `${API_ENDPOINTS.GET_POSTS_BY_EMPLOYEE}/${employeeId}`,
          { params },
        );

        setPosts(response.data.data);
        setTotal(response.data.total);
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.message || "Failed to load employee posts");
      } finally {
        setLoading(false);
      }
    }

    loadEmployeePosts();
  }, [employeeId, page, pageSize, hotReload]);

  return { posts, total, error, loading };
}
