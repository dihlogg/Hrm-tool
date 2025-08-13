"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import MainLayout from "@/components/common/main-layout";
import "@ant-design/v5-patch-for-react-19";
import { useIdleLogout } from "@/hooks/auth/useIdleLogout";

const navItems = [
  { href: "/pim", label: "Employee List" },
  { href: "/pim/add-employee", label: "Add Employee" },
];

export default function PimLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useIdleLogout(15)
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex gap-2 ml-3">
          {navItems.map((item) => {
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
