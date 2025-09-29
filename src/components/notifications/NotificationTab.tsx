"use client";

import { Avatar, Button, Tooltip } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNotifications } from "@/contexts/notificationContext";

export default function NotificationTab() {
  const { notifications, markAsRead } = useNotifications();

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-3 bg-white rounded-lg w-96">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b">
        <h3 className="text-lg font-semibold">Thông báo</h3>
      </div>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <div className="py-8 text-center text-gray-400">Không có thông báo</div>
      ) : (
        <div className="overflow-y-auto max-h-80">
          {notifications.map((notification) => {
            const avatarUrl =
              notification.payload?.employee?.imageUrl ||
              notification.payload?.imageUrl;

            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                {/* Avatar */}
                <Avatar size="large" src={avatarUrl} className="flex-shrink-0">
                  {!avatarUrl && notification.payload?.employee?.firstName?.[0]}
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/*message */}
                  <div className="mb-1 text-sm font-medium text-gray-900">
                    {notification.message}
                  </div>

                  {/* Time & Duration */}
                  {notification.payload?.fromDate &&
                    notification.payload?.toDate && (
                      <div className="mb-1 text-xs text-gray-600">
                        <div>
                          <strong>Time:</strong>{" "}
                          {formatDateTime(notification.payload.fromDate)}{" "}
                          {" to "}
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

                  {/* CreatedAt */}
                  <Tooltip title={formatDateTime(notification.createdAt)}>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <ClockCircleOutlined />
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </Tooltip>
                </div>

                {/* Dot unread */}
                {!notification.read && (
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t">
        <Button type="link" size="small" href="/notifications">
          Xem tất cả
        </Button>
      </div>
    </div>
  );
}
