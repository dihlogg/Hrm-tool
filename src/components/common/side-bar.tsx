"use client";

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  AuditOutlined,
  WechatWorkOutlined,
  FieldTimeOutlined,
  ReconciliationOutlined,
  ProfileOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarComponent = () => {
  const pathname = usePathname();
  const iconStyle = { fontSize: 20, fontWeight: 500, color: "#6B7280" };
  const labelStyle = { fontSize: 14, fontWeight: 500, color: "#6B7280" };

  const getSelectedKey = () => {
    if (pathname === "/" || pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/leave")) return "leave";
    if (pathname.startsWith("/pim")) return "pim";
    if (pathname.startsWith("/buzz")) return "buzz";
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname.startsWith("/authz")) return "authz";
    if (pathname.startsWith("/career")) return "career";
    return "dashboard"; // Fallback
  };

  return (
    <Layout.Sider
      theme="light"
      collapsible={true}
      breakpoint="md"
      className="shadow-lg"
      width={240}
      style={{ height: "100vh" }}
    >
      <div className="py-6 text-xl font-bold text-center text-orange-500">
        Dinh Long
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined style={iconStyle} />,
            label: <Link href="/dashboard" style={labelStyle}>Dashboard</Link>,
          },
          {
            key: "admin",
            icon: <ReconciliationOutlined style={iconStyle}/>,
            label: <Link href="/admin" style={labelStyle}>Admin</Link>,
          },
          {
            key: "leave",
            icon: <FieldTimeOutlined style={iconStyle}/>,
            label: <Link href="/leave" style={labelStyle}>Leave</Link>,
          },
          {
            key: "pim",
            icon: <AuditOutlined style={iconStyle}/>,
            label: <Link href="/pim" style={labelStyle}>Pim</Link>,
          },
          {
            key: "time",
            icon: <ProfileOutlined style={iconStyle}/>,
            label: <Link href="/time" style={labelStyle}>Time</Link>,
          },
          {
            key: "profile",
            icon: <UserOutlined style={iconStyle}/>,
            label: <Link href="/profile" style={labelStyle}>Profile</Link>,
          },
          {
            key: "buzz",
            icon: <WechatWorkOutlined style={iconStyle}/>,
            label: <Link href="/buzz" style={labelStyle}>Buzz</Link>,
          },
          {
            key: "authz",
            icon: <AuditOutlined style={iconStyle}/>,
            label: <Link href="/authz" style={labelStyle}>Authz</Link>,
          },
          {
            key: "career",
            icon: <PieChartOutlined style={iconStyle}/>,
            label: <Link href="/career" style={labelStyle}>Career</Link>,
          }
        ]}
      />
    </Layout.Sider>
  );
};

export default SidebarComponent;
