import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const SidebarComponent = () => (
  <Layout.Sider theme="light" className="shadow-lg" style={{ height: "100vh" }}>
    <div className="text-center py-4 font-bold text-orange-500 text-xl">
      Dinh Long
    </div>
    <Menu
      mode="inline"
      defaultSelectedKeys={["dashboard"]}
      items={[
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link href="/">Dashboard</Link>,
        },
        {
          key: "admin",
          icon: <UserOutlined />,
          label: <Link href="/leave">Leave</Link>,
        },
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: <Link href="/pim">Pim</Link>,
        },
      ]}
    />
  </Layout.Sider>
);

export default SidebarComponent;