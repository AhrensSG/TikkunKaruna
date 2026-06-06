'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const user: User | null = session?.user
    ? {
        id: session.user.id as string,
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || undefined,
        role: (session.user as any).role || 'user',
        created_at: '',
      }
    : null

  const register = async (data: { name: string; email: string; phone?: string; password: string }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error || 'Error al registrar')
    }

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error('Registrado pero error al iniciar sesión')
    }
  }

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error('Correo o contraseña incorrectos')
    }
  }

  const logout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <AuthContext.Provider value={{ user, loading: status === 'loading', login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
