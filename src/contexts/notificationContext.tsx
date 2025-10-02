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

interface NotificationContextType {
  notifications: NotificationPayload[];
  refreshNotifications: (
    page?: number,
    pageSize?: number
  ) => Promise<{
    data: NotificationPayload[];
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  }>;
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

      return response.data; // { data, total, currentPage, totalPages, pageSize }
    },
    [employee?.id]
  );

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // socket nhận notify, show toast và refresh lại notify
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: NotificationPayload) => {
      notification.success({
        message: "New Notification",
        description: data.message ?? "You have a new notification",
        placement: "bottomLeft",
      });
      refreshNotifications();
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, refreshNotifications]);

  return (
    <NotificationContext.Provider
      value={{ notifications, refreshNotifications }}
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
