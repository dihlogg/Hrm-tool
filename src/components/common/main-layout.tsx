"use client";

import { Layout } from "antd";
import SidebarComponent from "./side-bar";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="h-screen min-h-screen overflow-hidden">
      <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="flex flex-col h-full">
        <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout.Content
          className="relative p-3 bg-[#F1F5F9] flex-1 overflow-auto"
        >
          {children}
        </Layout.Content>
        <FooterComponent/>
      </Layout>
    </Layout>
  );
}