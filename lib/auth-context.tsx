"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useData } from '@/lib/data-context'

interface AuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  userPassword: string
  adminPassword: string
  login: (password: string) => boolean
  logout: () => void
  toggleAdminMode: () => void
  updateUserPassword: (password: string) => void
  updateAdminPassword: (password: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, updatePersistedUserPassword, updatePersistedAdminPassword } = useData()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem('choreo-auth')
    const adminSession = sessionStorage.getItem('choreo-admin')
    if (session === 'true') {
      setIsAuthenticated(true)
    }
    if (adminSession === 'true') {
      setIsAdmin(true)
    }
  }, [])

  const login = (password: string): boolean => {
    if (password === data.userPassword || password === data.adminPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem('choreo-auth', 'true')
      if (password === data.adminPassword) {
        setIsAdmin(true)
        sessionStorage.setItem('choreo-admin', 'true')
      } else {
        setIsAdmin(false)
        sessionStorage.removeItem('choreo-admin')
      }
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    sessionStorage.removeItem('choreo-auth')
    sessionStorage.removeItem('choreo-admin')
  }

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin)
  }

  const updateUserPassword = (password: string) => {
    updatePersistedUserPassword(password)
  }

  const updateAdminPassword = (password: string) => {
    updatePersistedAdminPassword(password)
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      userPassword: data.userPassword,
      adminPassword: data.adminPassword,
      login, 
      logout, 
      toggleAdminMode,
      updateUserPassword,
      updateAdminPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
