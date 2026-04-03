"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useData } from '@/lib/data-context'

const SESSION_MS = 3 * 60 * 60 * 1000
const KEY_AUTH = 'choreo-auth'
const KEY_AUTH_AT = 'choreo-auth-at'
const KEY_ADMIN = 'choreo-admin'

function isSessionExpired(loginAtMs: number): boolean {
  return Date.now() - loginAtMs > SESSION_MS
}

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

  const clearSessionStorage = useCallback(() => {
    sessionStorage.removeItem(KEY_AUTH)
    sessionStorage.removeItem(KEY_AUTH_AT)
    sessionStorage.removeItem(KEY_ADMIN)
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    clearSessionStorage()
  }, [clearSessionStorage])

  const enforceSessionOrLogout = useCallback(() => {
    if (sessionStorage.getItem(KEY_AUTH) !== 'true') return
    const atRaw = sessionStorage.getItem(KEY_AUTH_AT)
    const at = atRaw ? Number(atRaw) : NaN
    if (!Number.isFinite(at) || isSessionExpired(at)) {
      setIsAuthenticated(false)
      setIsAdmin(false)
      clearSessionStorage()
    }
  }, [clearSessionStorage])

  useEffect(() => {
    const session = sessionStorage.getItem(KEY_AUTH)
    const adminSession = sessionStorage.getItem(KEY_ADMIN)
    const atRaw = sessionStorage.getItem(KEY_AUTH_AT)
    const at = atRaw ? Number(atRaw) : NaN

    if (session === 'true') {
      if (!Number.isFinite(at) || isSessionExpired(at)) {
        clearSessionStorage()
        setIsAuthenticated(false)
        setIsAdmin(false)
        return
      }
      setIsAuthenticated(true)
      if (adminSession === 'true') {
        setIsAdmin(true)
      }
    }
  }, [clearSessionStorage])

  useEffect(() => {
    const id = setInterval(() => {
      enforceSessionOrLogout()
    }, 60_000)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        enforceSessionOrLogout()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enforceSessionOrLogout])

  const login = (password: string): boolean => {
    if (password === data.userPassword || password === data.adminPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem(KEY_AUTH, 'true')
      sessionStorage.setItem(KEY_AUTH_AT, String(Date.now()))
      if (password === data.adminPassword) {
        setIsAdmin(true)
        sessionStorage.setItem(KEY_ADMIN, 'true')
      } else {
        setIsAdmin(false)
        sessionStorage.removeItem(KEY_ADMIN)
      }
      return true
    }
    return false
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
