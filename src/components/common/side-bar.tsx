import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  AuditOutlined,
  WechatWorkOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarComponent = () => {
  const pathname = usePathname();

  const getSelectedKey = () => {
    if (pathname === "/") return "dashboard";
    if (pathname.startsWith("/leave")) return "leave";
    if (pathname.startsWith("/pim")) return "pim";
    if (pathname.startsWith("/time")) return "time";
    if (pathname.startsWith("/buzz")) return "buzz";
    return "dashboard"; // Fallback
  };

  return (
    <Layout.Sider theme="light" className="shadow-lg" style={{ height: "100vh" }}>
      <div className="py-4 text-xl font-bold text-center text-orange-500">
        Dinh Long
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link href="/">Dashboard</Link>,
          },
          {
            key: "leave",
            icon: <AuditOutlined />,
            label: <Link href="/leave">Leave</Link>,
          },
          {
            key: "pim",
            icon: <UserOutlined />,
            label: <Link href="/pim">Pim</Link>,
          },
          {
            key: "time",
            icon: <FieldTimeOutlined />,
            label: <Link href="/time">Time</Link>,
          },
          {
            key: "buzz",
            icon: <WechatWorkOutlined />,
            label: <Link href="/buzz">Buzz</Link>,
          },
        ]}
      />
    </Layout.Sider>
  );
};

export default SidebarComponent;