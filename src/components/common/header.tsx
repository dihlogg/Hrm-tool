"use client";

import { Avatar, Badge, Button, Dropdown, Layout, Popover } from "antd";
import {
  BellTwoTone,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NotificationTab from "../notifications/NotificationTab";
import { useNotifications } from "@/contexts/notificationContext"; // Import từ context mới

const HeaderComponent = () => {
  const router = useRouter();
  const { employee, logout } = useAuthContext();
  const { notifications, markAllAsRead } = useNotifications(); // Sử dụng từ context
  const [isVisible, setIsVisible] = useState(false);

  const menuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => {
        router.push("/profile");
      },
    },
    {
      key: "changePassword",
      label: "Change Password",
      icon: <SettingOutlined />,
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: async () => {
        await logout();
      },
    },
  ];

  const fullName = employee
    ? `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim()
    : "Unknown User";

  // Tính số notification chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handlePopoverOpenChange = (visible: boolean) => {
    setIsVisible(visible);

    // Khi mở popover, tự động đánh dấu tất cả là đã đọc
    if (visible && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const content = <NotificationTab />;

  return (
    <Layout.Header
      style={{ backgroundColor: "#FB860D", height: "68px" }}
      className="flex items-center justify-between !px-8 shadow-md"
    >
      <div className="text-xl font-extrabold text-transparent transition-all duration-300 cursor-pointer md:text-3xl bg-clip-text bg-gradient-to-r from-white to-yellow-200 hover:from-yellow-200 hover:to-white drop-shadow-md animate-fade-in">
        LTD Hrm
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Popover
          content={content}
          trigger="click"
          open={isVisible}
          onOpenChange={handlePopoverOpenChange}
          placement="bottomRight"
        >
          <Badge count={unreadCount} offset={[-5, 5]} showZero={false}>
            <Button
              type="default"
              shape="circle"
              variant="filled"
              icon={
                <BellTwoTone
                  twoToneColor={
                    isVisible
                      ? "#1890ff"
                      : unreadCount > 0
                      ? "#1890ff"
                      // : "#a69ca0"
                      : "#b2c6db"
                  }
                  style={{
                    fontSize: "26px",
                  }}
                />
              }
              className={`p-2 cursor-pointer !bg-white shadow-none hover:shadow-md flex items-center justify-center transition ${
                unreadCount > 0 ? "ring-2 ring-red-300" : ""
              }`}
              size="large"
            />
          </Badge>
        </Popover>

        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 text-white bg-white/20 rounded-full cursor-pointer !bg-opacity-80 hover:bg-white/30 transition-colors">
            <Avatar
              size={50}
              src={employee?.imageUrl || undefined}
              icon={!employee?.imageUrl ? <UserOutlined /> : undefined}
              className="border-2 border-white/50"
            />
            <span className="hidden text-sm font-medium md:inline whitespace-nowrap">
              {fullName}
            </span>
            <DownOutlined className="hidden text-xs md:inline" />
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
};

export default HeaderComponent;
