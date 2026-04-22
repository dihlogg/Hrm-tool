"use client";

import { Layout } from "antd";
import SidebarComponent from "./side-bar";
import HeaderComponent from "./header";
import FooterComponent from "./footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="h-screen min-h-screen overflow-hidden">
      <SidebarComponent />
      <Layout className="flex flex-col h-full">
        <HeaderComponent />
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