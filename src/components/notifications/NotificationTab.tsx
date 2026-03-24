"use client";

import { Avatar, Button, Tooltip, Spin } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNotifications } from "@/contexts/notificationContext";
import { useState, useEffect } from "react";

interface NotificationTabProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export default function NotificationTab({
  onClose,
  isMobile = false,
}: NotificationTabProps) {
  const { notifications, refreshNotifications, pagination } =
    useNotifications();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCreatedDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      minute: "2-digit",
      hour: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchNotifications = async (page: number) => {
    setLoading(true);
    try {
      const res = await refreshNotifications(page, 5);
      setTotalPages(res.totalPages);
      setPage(res.currentPage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  return (
    <div
      className={`w-full bg-white ${
        isMobile
          ? "h-full flex flex-col"
          : "max-w-md p-2 mx-auto sm:p-3 rounded-lg"
      }`}
    >
      {!isMobile && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b sm:pb-3 sm:mb-3">
          <h3 className="text-base font-semibold sm:text-lg">Notifications</h3>
        </div>
      )}

      {notifications.length === 0 && !loading ? (
        <div className="py-4 text-sm text-center text-gray-400 sm:text-base sm:py-6">
          No notifications yet
        </div>
      ) : (
        <div
          className={`overflow-y-auto ${
            isMobile
              ? "flex-1 pb-4"
              : "max-h-[60vh] sm:max-h-[400px] md:max-h-[500px]"
          }`}
        >
          {notifications.map((notification) => {
            const avatarUrl =
              notification.actor?.avatarUrl ||
              notification.payload?.employee?.imageUrl ||
              notification.payload?.imageUrl;

            return (
              <div
                key={notification._id}
                className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded cursor-pointer transition-colors ${
                  !notification.read ? "bg-blue-50" : ""
                } w-full mb-2`}
              >
                <Avatar
                  size={{ xs: 25, sm: 30, md: 35, lg: 40, xl: 45, xxl: 50 }}
                  src={avatarUrl}
                  className="flex-shrink-0"
                >
                  {!avatarUrl && notification.payload?.employee?.firstName?.[0]}
                </Avatar>

                <div className="flex items-start justify-between flex-1 min-w-0 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 text-base font-medium text-gray-900 break-words sm:text-sm line-clamp-2">
                      {notification.message}
                    </div>

                    {(notification.type === "LEAVE_REQUEST_CREATED" ||
                      notification.type === "LEAVE_REQUEST_STATUS_UPDATED" ||
                      notification.type === "LEAVE_REQUEST_UPDATED") &&
                      notification.payload?.fromDate &&
                      notification.payload?.toDate && (
                        <div className="mb-1 text-xs text-gray-600 break-words sm:text-sm">
                          <div className="mb-0.5">
                            <strong>Time:</strong>{" "}
                            {formatDateTime(notification.payload.fromDate)} -{" "}
                            {formatDateTime(notification.payload.toDate)}
                          </div>
                          {notification.payload?.duration && (
                            <div>
                              <strong>Duration:</strong>{" "}
                              {notification.payload.duration} ngày
                            </div>
                          )}
                        </div>
                      )}

                    {notification.type === "USER_MENTIONED" &&
                      notification.payload?.content && (
                        <div className="mb-1 text-xs italic text-gray-500 break-words sm:text-sm line-clamp-1">
                        </div>
                      )}

                    <Tooltip title={formatCreatedDate(notification.createdAt)}>
                      <span className="flex items-center gap-1 text-xs text-gray-400 sm:text-sm">
                        <ClockCircleOutlined className="text-xs sm:text-sm" />
                        {formatCreatedDate(notification.createdAt)}
                      </span>
                    </Tooltip>
                  </div>

                  {!notification.read && (
                    <div className="flex items-start flex-shrink-0 pt-1 sm:pt-1.5">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="py-4 text-center">
              <Spin size="small" />
            </div>
          )}

          {pagination.currentPage < pagination.totalPages && !loading && (
            <div className="px-2 py-4 text-center">
              <Button
                type="primary"
                size="middle"
                shape="round"
                style={{ width: "100%" }}
                onClick={() => fetchNotifications(pagination.currentPage + 1)}
                className="text-white bg-blue-500 hover:bg-blue-600"
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
