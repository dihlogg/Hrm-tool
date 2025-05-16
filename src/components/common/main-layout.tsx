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
    <Layout style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}>
      <SidebarComponent />
      <Layout style={{ height: "100%" }}>
        <HeaderComponent />
        <Layout.Content
          className="p-3 bg-[#F1F5F9]"
          style={{ height: "calc(100% - 64px - 40px)", overflow: "auto" }}
        >
          {children}
        </Layout.Content>
        <FooterComponent/>
      </Layout>
    </Layout>
  );
}