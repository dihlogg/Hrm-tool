"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

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
    <div className="flex flex-col h-full">
      {/* Nav bar */}
      <div className="flex gap-2 ml-3">
        {navGroups.map((group) => {
          const menuItems = group.items.map((item) => {
            const isActive = pathname === item.href;

            return {
              key: item.href,
              label: (
                <Link href={item.href}>
                  <div
                    className={`px-4 py-1 ${
                      isActive ? "font-semibold text-[#f66c13]" : ""
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
                className={`px-5 py-2 text-xs font-medium rounded-full border transition-colors 
                bg-[#F9FAFB] !text-[#155DFB] border-gray-200 hover:bg-[#FFF2E8] hover:text-[#F66C13] cursor-pointer`}
              >
                {group.label} <DownOutlined className="ml-1" />
              </button>
            </Dropdown>
          );
        })}
      </div>

      {/* Page content */}
      <div className="flex flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
