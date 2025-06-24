'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

const navItems = [
]

export default function LeaveLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center flex-1">
        {children}
      </div>
    </div>
  )
}