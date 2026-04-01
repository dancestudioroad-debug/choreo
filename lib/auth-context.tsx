"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

// Default passwords
const DEFAULT_USER_PASSWORD = "choreo2024"
const DEFAULT_ADMIN_PASSWORD = "admin2024"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userPassword, setUserPassword] = useState(DEFAULT_USER_PASSWORD)
  const [adminPassword, setAdminPassword] = useState(DEFAULT_ADMIN_PASSWORD)

  useEffect(() => {
    // Check for existing session
    const session = sessionStorage.getItem('choreo-auth')
    const adminSession = sessionStorage.getItem('choreo-admin')
    if (session === 'true') {
      setIsAuthenticated(true)
    }
    if (adminSession === 'true') {
      setIsAdmin(true)
    }
    
    // Load saved passwords
    const savedUserPass = localStorage.getItem('choreo-user-password')
    const savedAdminPass = localStorage.getItem('choreo-admin-password')
    if (savedUserPass) setUserPassword(savedUserPass)
    if (savedAdminPass) setAdminPassword(savedAdminPass)
  }, [])

  const login = (password: string): boolean => {
    if (password === userPassword || password === adminPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem('choreo-auth', 'true')
      if (password === adminPassword) {
        setIsAdmin(true)
        sessionStorage.setItem('choreo-admin', 'true')
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
    setUserPassword(password)
    localStorage.setItem('choreo-user-password', password)
  }

  const updateAdminPassword = (password: string) => {
    setAdminPassword(password)
    localStorage.setItem('choreo-admin-password', password)
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      userPassword,
      adminPassword,
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
