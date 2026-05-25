'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function generateId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tk_user')
      return stored ? JSON.parse(stored) : null
    }
    return null
  })
  const [loading] = useState(false)

  const register = async (data: { name: string; email: string; phone?: string; password: string }) => {
    const users = JSON.parse(localStorage.getItem('tk_users') || '[]') as (User & { password: string })[]

    if (users.find((u) => u.email === data.email)) {
      throw new Error('Ya existe una cuenta con ese correo electrónico')
    }

    const newUser: User & { password: string } = {
      id: generateId(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      role: 'user',
      createdAt: new Date(),
      password: data.password,
    }

    users.push(newUser)
    localStorage.setItem('tk_users', JSON.stringify(users))

    const { password: _, ...safeUser } = newUser
    localStorage.setItem('tk_user', JSON.stringify(safeUser))
    setUser(safeUser)
  }

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('tk_users') || '[]') as (User & { password: string })[]
    const found = users.find((u) => u.email === email && u.password === password)

    if (!found) {
      throw new Error('Correo o contraseña incorrectos')
    }

    const { password: _, ...safeUser } = found
    localStorage.setItem('tk_user', JSON.stringify(safeUser))
    setUser(safeUser)
  }

  const logout = () => {
    localStorage.removeItem('tk_user')
    setUser(null)
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
