import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarComponent = () => {
  const pathname = usePathname();

  const getSelectedKey = () => {
    if (pathname === "/") return "dashboard";
    if (pathname.startsWith("/leave")) return "leave";
    if (pathname.startsWith("/pim")) return "pim";
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
            icon: <UserOutlined />,
            label: <Link href="/leave">Leave</Link>,
          },
          {
            key: "pim",
            icon: <SettingOutlined />,
            label: <Link href="/pim">Pim</Link>,
          },
        ]}
      />
    </Layout.Sider>
  );
};

export default SidebarComponent;