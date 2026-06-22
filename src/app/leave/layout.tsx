"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import MainLayout from "@/components/common/main-layout";
import { useAuthContext } from "@/contexts/authContext";
import "@ant-design/v5-patch-for-react-19";

const navItems = [
  { href: "/leave", label: "Leave Dashboard" },
  { href: "/leave/my-leave", label: "My Leave" },
  { href: "/leave/create-leave", label: "Create New Leave" },
  { href: "/leave/receive-leave", label: "Receive Leave" },
];

export default function LeaveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userRoles } = useAuthContext();
  const isAtLeastAdmin = Array.isArray(userRoles) && (userRoles.includes("Super Admin") || userRoles.includes("Admin"));

  const filteredNavItems = navItems.filter((item) => {
    if (item.href === "/leave/receive-leave" && !isAtLeastAdmin) return false;
    return true;
  });

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex flex-wrap gap-2 ml-3 sm:gap-3 sm:ml-4">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            const baseClass =
              "px-4 py-2 text-xs font-medium rounded-full border transition-colors !bg-[#F9FAFB]";
            const activeClass =
              "!bg-[#FFF2E8] !border-[#F9FAFB] !bg-[#F9FAFB] font-medium";
            const inactiveClass =
              "bg-white text-gray-600 border-gray-200 !hover:bg-[#FFF2E8] hover:text-[#F66C13]";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseClass} ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
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
