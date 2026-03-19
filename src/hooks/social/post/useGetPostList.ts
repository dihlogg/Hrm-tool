"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { PaginatedResponse } from "@/types/pagination";
import axiosInstance from "@/utils/auth/axiosInstance";
import { PostDto } from "./PostDto";
import { PostFilters } from "./PostFiltersDto";

export function useGetPostList(
  page: number,
  pageSize: number,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  filters: PostFilters = {},
  hotReload: number = 0,
) {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);

      const cleanedFilters: Record<string, string> = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value && value.trim() !== "",
        ),
      );

      const params: any = {
        page,
        pageSize,
        ...cleanedFilters,
      };

      if (sortBy && sortOrder) {
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }

      try {
        const response = await axiosInstance.get<PaginatedResponse<PostDto>>(
          API_ENDPOINTS.GET_POST_LIST,
          { params },
        );

        setPosts(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [page, pageSize, sortBy, sortOrder, JSON.stringify(filters), hotReload]);

  return { posts, total, error, loading, hotReload };
}
