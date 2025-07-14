"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import MainLayout from "@/components/common/main-layout";

const navGroups = [
  {
    label: "Timesheets",
    items: [
      { href: "/time/my-timesheet", label: "My Timesheets" },
      { href: "/time/emp-timesheet", label: "Employee Timesheets" },
    ],
  },
  {
    label: "Attendance",
    items: [
      { href: "/time/my-record", label: "My Records" },
      { href: "/time/emp-record", label: "Employee Records" },
    ],
  },
  {
    label: "Tracking",
    items: [
      { href: "/time/punch-in", label: "Punch In" },
      { href: "/time/punch-out", label: "Punch Out" },
    ],
  },
];

export default function TimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex gap-2 ml-3">
          {navGroups.map((group) => {
            const isGroupActive = group.items.some((item) =>
              pathname.startsWith(item.href)
            );

            const menuItems = group.items.map((item) => {
              const isActive = pathname === item.href;

              return {
                key: item.href,
                label: (
                  <Link href={item.href}>
                    <div
                      className={`px-3 py-1 ${
                        isActive
                          ? "text-xs font-medium text-[#4096FF]"
                          : "text-xs font-small text-gray-600"
                      }`}
                    >
                      {item.label}
                    </div>
                  </Link>
                ),
              };
            });

            return (
              <Dropdown
                key={group.label}
                menu={{ items: menuItems }}
                trigger={["click"]}
              >
                <button
                  className={`px-4 py-2 text-xs font-medium rounded-full border text-blue-600 transition-colors 
                ${
                  isGroupActive
                    ? "!bg-[#FFF2E8] !border-[#F9FAFB] !text-blue-600 text-xs font-medium"
                    : "bg-[#F9FAFB] !text-blue-600 border-gray-200 hover:text-[#F66C13] transition-all hover:opacity-65"
                } cursor-pointer`}
                >
                  {group.label} <DownOutlined className="ml-1" />
                </button>
              </Dropdown>
            );
          })}
        </div>

        <div className="flex flex-1 w-full">{children}</div>
      </div>
    </MainLayout>
  );
}
