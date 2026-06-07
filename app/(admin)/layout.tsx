'use client'

import { useState } from 'react'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AuthGuard from '@/components/AuthGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardNavbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />
        <div className="flex flex-1">
          <AdminSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
