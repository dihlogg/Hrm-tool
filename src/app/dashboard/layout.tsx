"use client";

import React from "react";
import MainLayout from "@/components/common/main-layout";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DashboardOutlined } from "@ant-design/icons";
import { useIdleLogout } from "@/hooks/auth/useIdleLogout";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: <DashboardOutlined /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useIdleLogout(15);

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex flex-wrap gap-2 pt-4 ml-3 sm:gap-3 sm:ml-4 pb-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const baseClass =
              "px-4 py-2 text-sm font-medium rounded-full border transition-colors flex items-center gap-2";
            const activeClass =
              "bg-[#FFF2E8] border-[#F9FAFB] text-[#F66C13]";
            const inactiveClass =
              "bg-white text-gray-600 border-gray-200 hover:bg-[#FFF2E8] hover:text-[#F66C13]";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseClass} ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-1 w-full">{children}</div>
      </div>
    </MainLayout>
  );
}
