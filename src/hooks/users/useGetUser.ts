"use client";

import { useEffect, useState } from "react";
import { UserFilters } from "./UserFiltersDto";
import axiosInstance from "@/utils/auth/axiosInstance";
import { PaginatedResponse } from "@/types/pagination";
import { API_ENDPOINTS } from "@/services/apiService";
import { UserDto } from "./UserDto";

export function useGetUsers(
  page: number,
  pageSize: number,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  filters: UserFilters = {},
  hotReload: number = 0
) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const cleanedFilters: Record<string, string> = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value && value.trim() !== ""
        )
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
        const response = await axiosInstance.get<PaginatedResponse<UserDto>>(
          API_ENDPOINTS.GET_USER_LIST,
          { params }
        );
        setUsers(response.data.data);
        setTotal(response.data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [page, pageSize, sortBy, sortOrder, JSON.stringify(filters), hotReload]);
  return { users, total, error, loading, hotReload };
}
