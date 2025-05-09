'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

const navItems = [
  { href: '/leave', label: 'Leave Dashboard' },
  { href: '/leave/my-leave', label: 'My Leave' },
  { href: '/leave/create-leave', label: 'Create New Leave' },
  { href: '/leave/receive-leave', label: 'Receive Leave' },
]

export default function LeaveLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 ml-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const baseClass = 'px-4 py-2 text-xs font-medium rounded-full border transition-colors !bg-[#F9FAFB]'
          const activeClass = '!bg-[#FFF2E8] !border-[#F9FAFB] !bg-[#F9FAFB] font-medium'
          const inactiveClass = 'bg-white text-gray-600 border-gray-200 !hover:bg-[#FFF2E8] hover:text-[#F66C13]'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
      <div className="flex items-center justify-center flex-1">
        {children}
      </div>
    </div>
  )
}