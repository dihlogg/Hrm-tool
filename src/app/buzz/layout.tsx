"use client";

import { usePathname } from "next/navigation";
import "@ant-design/v5-patch-for-react-19";
import React from "react";
import MainLayout from "@/components/common/main-layout";

const navItems = [];

export default function BuzzLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center flex-1">
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
