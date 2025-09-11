"use client";

import { Avatar, Button, Dropdown, Layout } from "antd";
import {
  BellTwoTone,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

const HeaderComponent = () => {
  const router = useRouter();
  const { employee, logout } = useAuthContext();

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

  return (
    <Layout.Header
      style={{ backgroundColor: "#FB860D", height: "68px" }}
      className="flex items-center justify-between !px-8 shadow-md"
    >
      <div className="text-xl font-extrabold text-transparent transition-all duration-300 cursor-pointer md:text-3xl bg-clip-text bg-gradient-to-r from-white to-yellow-200 hover:from-yellow-200 hover:to-white drop-shadow-md animate-fade-in">
        LTD Hrm
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Button
          type="default"
          shape="circle"
          variant="filled"
          icon={
            <BellTwoTone
              style={{ fontSize: "26px", color: "#4F5152", marginTop: "22px" }}
            />
          }
          className="p-2 text-gray-600 cursor-pointer hover:text-blue-800 !bg-white shadow-none hover:shadow-md flex items-center justify-center transition"
          size="large"
        />

        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 text-white bg-white/20 rounded-full cursor-pointer !bg-opacity-80">
            <Avatar
              size={50}
              src={employee?.imageUrl || undefined}
              icon={!employee?.imageUrl ? <UserOutlined /> : undefined}
            />
            {/* hiden for phone screen */}
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
