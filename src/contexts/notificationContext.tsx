"use client";

import { useSocket } from "@/hooks/socket/useWebSocket";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuthContext } from "./authContext";
import { NotificationPayload } from "@/types/notifications/notificationPayload";
import { notification } from "antd";
import { PaginatedResponse } from "@/types/pagination";

interface NotificationContextType {
  notifications: NotificationPayload[];
  refreshNotifications: (
    page?: number,
    pageSize?: number
  ) => Promise<PaginatedResponse<NotificationPayload>>;
  unSeenCount: number;
  refreshUnSeenCount: () => Promise<void>;
  pagination: Omit<PaginatedResponse<NotificationPayload>, "data">;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    pageSize: 5,
    totalPages: 0,
  });
  const [unSeenCount, setUnSeenCount] = useState(0);
  const { employee } = useAuthContext();

  // get notify from mongo by employee id
  const refreshNotifications = useCallback(
    async (page = 1, pageSize = 5) => {
      if (!employee?.id) return { data: [], totalPages: 0, currentPage: 1 };

      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GET_LEAVE_REQUEST_NOTIFY}/${employee.id}`,
        { params: { page, pageSize } }
      );

      if (page === 1) {
        setNotifications(response.data.data);
      } else {
        setNotifications((prev) => [...prev, ...response.data.data]);
      }
      setPagination({
        total: response.data.total,
        currentPage: response.data.currentPage,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      });

      return response.data;
    },
    [employee?.id]
  );

  // Get unseen count
  const refreshUnSeenCount = useCallback(async () => {
    if (!employee?.id) return;
    const res = await axiosInstance.get(
      `${API_ENDPOINTS.GET_UNSEEN_COUNT_BY_RECIPIENT_ID}/${employee.id}`
    );
    setUnSeenCount(res.data);
  }, [employee?.id]);

  useEffect(() => {
    if (employee?.id) {
      refreshNotifications();
      refreshUnSeenCount();
    }
  }, [employee?.id]);

  // socket nhận notify, show toast và refresh lại notify
  useEffect(() => {
    if (!socket) return;

    const handleNotification = async (data: NotificationPayload) => {
      notification.success({
        message: "New Notification",
        description: data.message ?? "You have a new notification",
        placement: "bottomLeft",
      });

      // Refresh notify + unseen count
      await refreshNotifications();
      await refreshUnSeenCount();
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, refreshNotifications, refreshUnSeenCount]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unSeenCount,
        refreshNotifications,
        refreshUnSeenCount,
        pagination,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
