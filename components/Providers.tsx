'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/context/AuthContext'
import PhoneReminderModal from '@/components/PhoneReminderModal'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <PhoneReminderModal />
      </AuthProvider>
    </SessionProvider>
  )
}
