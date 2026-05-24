'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: Partial<User> & { password: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading] = useState(true)

  const login = async (_email: string, _password: string) => {
    // auth login logic
  }

  const logout = async () => {
    setUser(null)
  }

  const register = async (_data: Partial<User> & { password: string }) => {
    // registration logic
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
