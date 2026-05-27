import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import UserSidebar from '@/components/dashboard/UserSidebar'
import AuthGuard from '@/components/AuthGuard'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardNavbar />
        <div className="flex flex-1">
          <UserSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
