"use client";

import { Avatar, Badge, Button, Dropdown, Layout, Popover, Drawer } from "antd";
import {
  BellTwoTone,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationTab from "../notifications/NotificationTab";
import { useNotifications } from "@/contexts/notificationContext";
import { useGetUnSeenCountByActorId } from "@/hooks/notifications/useGetUnSeenCountByActorId";
import { usePatchMarkAsAllSeen } from "@/hooks/notifications/usePatchMarkAsAllSeen";

const HeaderComponent = () => {
  const router = useRouter();
  const { employee, logout } = useAuthContext();
  const { refreshNotifications } = useNotifications();

  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const { unSeenCount: serverUnSeenCount } = useGetUnSeenCountByActorId(
    employee?.id || ""
  );
  const { markAsAllSeen } = usePatchMarkAsAllSeen();

  const [localUnSeenCount, setLocalUnSeenCount] = useState(0);

  useEffect(() => {
    setLocalUnSeenCount(serverUnSeenCount);
  }, [serverUnSeenCount]);

  const menuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => router.push("/profile"),
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

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      if (!mobile && isMobile && isDrawerVisible) {
        setIsDrawerVisible(false);
      }
      if (mobile && !isMobile && isPopoverVisible) {
        setIsPopoverVisible(false);
      }
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile, isDrawerVisible, isPopoverVisible]);

  // mark all seen + refresh notifications + refetch count
  const handleMarkAsSeenAndRefresh = async () => {
    if (localUnSeenCount > 0 && employee?.id) {
      await markAsAllSeen(employee.id);
      await refreshNotifications(1, 5);
      setLocalUnSeenCount(0);
    }
  };

  const handlePopoverOpenChange = async (visible: boolean) => {
    setIsPopoverVisible(visible);
    if (visible) await handleMarkAsSeenAndRefresh();
  };

  const handleDrawerOpen = async () => {
    setIsDrawerVisible(true);
    await handleMarkAsSeenAndRefresh();
  };

  const handleDrawerClose = () => setIsDrawerVisible(false);

  const handleNotificationClick = () => {
    if (isMobile) {
      handleDrawerOpen();
    } else {
      handlePopoverOpenChange(!isPopoverVisible);
    }
  };

  const notificationContent = (
    <NotificationTab
      onClose={() => {
        setIsDrawerVisible(false);
        setIsPopoverVisible(false);
      }}
      isMobile={isMobile}
    />
  );

  return (
    <Layout.Header
      style={{ backgroundColor: "#FB860D", height: "70px" }}
      className="flex items-center justify-between !px-8 shadow-md"
    >
      <div className="text-xl font-extrabold text-transparent transition-all duration-300 cursor-pointer md:text-3xl bg-clip-text bg-gradient-to-r from-white to-yellow-200 hover:from-yellow-200 hover:to-white drop-shadow-md animate-fade-in">
        LTD Hrm
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Badge count={localUnSeenCount} offset={[-5, 5]} showZero={false}>
          {!isMobile ? (
            <Popover
              content={notificationContent}
              trigger="click"
              open={isPopoverVisible}
              onOpenChange={handlePopoverOpenChange}
              placement="bottomRight"
            >
              <Button
                type="default"
                shape="circle"
                variant="filled"
                icon={
                  <BellTwoTone
                    twoToneColor={
                      isPopoverVisible
                        ? "#1890ff"
                        : localUnSeenCount > 0
                        ? "#1890ff"
                        : "#b2c6db"
                    }
                    style={{ fontSize: "26px" }}
                  />
                }
                className={`p-2 cursor-pointer !bg-white shadow-none hover:shadow-md flex items-center justify-center transition ${
                  localUnSeenCount > 0 ? "ring-2 ring-red-300" : ""
                }`}
                size="large"
              />
            </Popover>
          ) : (
            <Button
              type="default"
              shape="circle"
              variant="filled"
              icon={
                <BellTwoTone
                  twoToneColor={
                    isDrawerVisible
                      ? "#1890ff"
                      : localUnSeenCount > 0
                      ? "#1890ff"
                      : "#b2c6db"
                  }
                  style={{ fontSize: "26px" }}
                />
              }
              onClick={handleNotificationClick}
              className={`p-2 cursor-pointer !bg-white shadow-none hover:shadow-md flex items-center justify-center transition ${
                localUnSeenCount > 0 ? "ring-2 ring-red-300" : ""
              }`}
              size="large"
            />
          )}
        </Badge>

        {/* Mobile Drawer */}
        <Drawer
          title="Thông báo"
          placement="right"
          open={isDrawerVisible}
          onClose={handleDrawerClose}
          width={isMobile ? "85%" : 400}
          styles={{
            body: {
              padding: "16px",
              height: "100%",
            },
          }}
        >
          {notificationContent}
        </Drawer>

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
