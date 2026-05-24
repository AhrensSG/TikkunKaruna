import DashboardNavbar from '@/components/layout/DashboardNavbar'
import UserSidebar from '@/components/layout/UserSidebar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardNavbar />
      <div className="flex flex-1">
        <UserSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
