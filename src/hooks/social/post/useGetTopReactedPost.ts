"use client";

import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { PostDto } from "./PostDto";
import { PostFilters } from "./PostFiltersDto";
import { CursorPaginatedResponse } from "@/types/pagination/cursor-pagination";

export function useGetTopReactedPost(
  limit: number,
  filters: PostFilters = {},
  hotReload: number = 0,
) {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(
    async (cursor: string | null = null, isRefresh: boolean = false) => {
      setLoading(true);
      setError("");

      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          (entry) => entry[1] && entry[1].trim() !== "",
        ),
      );

      const params = {
        limit,
        ...(cursor ? { cursor } : {}),
        ...cleanedFilters,
      };

      try {
        const response = await axiosInstance.get<
          CursorPaginatedResponse<PostDto>
        >(API_ENDPOINTS.GET_TOP_REACTED_POST, { params });

        if (isRefresh) {
          setPosts(response.data.data);
        } else {
          setPosts((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewItems = response.data.data.filter(
              (item) => !existingIds.has(item.id),
            );
            return [...prev, ...uniqueNewItems];
          });
        }

        setNextCursor(response.data.nextCursor);
        setHasNextPage(response.data.hasNextPage);
      } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limit, JSON.stringify(filters)],
  );

  useEffect(() => {
    fetchPosts(null, true);
  }, [fetchPosts, hotReload]);

  const loadMore = () => {
    if (hasNextPage && !loading && nextCursor) {
      fetchPosts(nextCursor, false);
    }
  };

  return { posts, hasNextPage, error, loading, loadMore };
}
