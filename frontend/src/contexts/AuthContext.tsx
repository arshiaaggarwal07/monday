// frontend/src/contexts/AuthContext.tsx

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import api from '../api/client'

interface AuthContextType {
  user:     User | null
  loading:  boolean
  login:    (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout:   () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function restoreSession() {
    try {
      const { data: tokenData } = await api.post('/auth/refresh')
      localStorage.setItem('accessToken', tokenData.accessToken)

      const { data: userData } = await api.get('/auth/me')
      setUser(userData)
    } catch {
      // No session — this is the normal state for a logged-out visitor.
      // Do nothing except clear stale tokens. Do NOT redirect here.
      localStorage.removeItem('accessToken')
    } finally {
      setLoading(false)
    }
  }

  restoreSession()
}, [])

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('accessToken', data.accessToken)
    setUser(data.user)
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('accessToken', data.accessToken)
    setUser(data.user)
  }

  async function logout() {
    await api.post('/auth/logout')
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}