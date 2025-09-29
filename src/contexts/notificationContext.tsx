"use client";

import { useSocket } from "@/hooks/socket/useWebSocket";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useAuthContext } from "./authContext";
import { NotificationPayload } from "@/types/notifications/notificationPayload";

interface NotificationContextType {
  notifications: NotificationPayload[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const { employee } = useAuthContext();

  useEffect(() => {
    if (!employee?.id) return;
    const getNotify = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.GET_LEAVE_REQUEST_NOTIFY}/${employee.id}`
        );
        setNotifications(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } catch (err: any) {
        console.error(
          err.response?.data?.message || "Failed to load notifications"
        );
      } finally {
        setLoading(false);
      }
    };
    getNotify();
  }, [!employee?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: any) => {
      const notification = {
        id: data.id || data._id || `temp-${Date.now()}`,
        type: data.type || "LEAVE_REQUEST_CREATED",
        message: data.message || "New notification",
        payload: data.payload || data,
        read: false,
        createdAt: data.createdAt || new Date().toISOString(),
      };

      setNotifications((prev) =>
        prev.some((n) => n.id === notification.id)
          ? prev
          : [notification, ...prev]
      );
    };

    socket.on("notification", handleNewNotification);
    socket.on("LEAVE_REQUEST_CREATED", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
      socket.off("LEAVE_REQUEST_CREATED", handleNewNotification);
    };
  }, [socket]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
