import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AuthGuard from '@/components/AuthGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardNavbar />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
