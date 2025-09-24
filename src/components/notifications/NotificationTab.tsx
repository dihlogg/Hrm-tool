// components/notifications/NotificationTab.tsx
"use client";

import { Avatar, Button, Tag, Tooltip } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNotifications } from "@/contexts/notificationContext";

export default function NotificationTab() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeDisplayName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      LEAVE_REQUEST_CREATED: "Yêu cầu nghỉ phép mới",
      LEAVE_REQUEST_APPROVED: "Yêu cầu đã được duyệt",
      LEAVE_REQUEST_REJECTED: "Yêu cầu bị từ chối",
    };
    return typeMap[type] || type.replace(/_/g, " ");
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-lg w-96">
      <div className="flex items-center justify-between pb-3 mb-3 border-b">
        <h3 className="text-lg font-semibold">Thông báo</h3>
        <span className="text-sm text-gray-500">
          {notifications.length} thông báo
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mb-2 text-4xl">🔔</div>
          <p className="text-sm text-gray-400">Không có thông báo</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-80">
          {notifications.map((notification) => {
            const avatarUrl =
              notification.payload?.employee?.imageUrl ||
              notification.payload?.imageUrl ||
              "https://via.placeholder.com/40";

            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer border-l-4 ${
                  !notification.read
                    ? "bg-blue-50 border-l-blue-500"
                    : "border-l-transparent"
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <Avatar
                    size="small"
                    src={avatarUrl}
                    icon={!avatarUrl || avatarUrl.includes("placeholder")}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag>{getTypeDisplayName(notification.type)}</Tag>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>

                  <p className="mb-1 text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>

                  {notification.payload && (
                    <div className="mb-1 text-xs text-gray-500">
                      {notification.payload.employee && (
                        <span>
                          Nhân viên: {notification.payload.employee.firstName}{" "}
                          {notification.payload.employee.lastName}
                        </span>
                      )}
                      {notification.payload.fromDate && (
                        <div>
                          Từ: {formatDate(notification.payload.fromDate)}
                        </div>
                      )}
                      {notification.payload.toDate && (
                        <div>
                          Đến: {formatDate(notification.payload.toDate)}
                        </div>
                      )}
                      {notification.payload.duration && (
                        <div>
                          Thời gian: {notification.payload.duration} ngày
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    <Tooltip title={formatDate(notification.createdAt)}>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <ClockCircleOutlined />
                        {new Date(notification.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </Tooltip>

                    {notification.read ? (
                      <CheckCircleOutlined className="text-xs text-green-500" />
                    ) : (
                      <span className="text-xs text-blue-500">Mới</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 mt-3 border-t">
        <Button
          type="link"
          size="small"
          onClick={() => {
            // Mark all as read
            notifications.forEach((notif) => {
              if (!notif.read) markAsRead(notif.id);
            });
          }}
        >
          Đánh dấu tất cả đã đọc
        </Button>

        <Button type="link" size="small" href="/notifications">
          Xem tất cả
        </Button>
      </div>
    </div>
  );
}
