"use client"

import { useState, useEffect, useRef } from 'react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { DataProvider } from '@/lib/data-context'
import { LoginPage } from '@/components/login-page'
import { Navigation } from '@/components/navigation'
import { Dashboard } from '@/components/dashboard'
import { InfoHub } from '@/components/info-hub'
import { Calculator } from '@/components/calculator'
import { AdminPanel } from '@/components/admin-panel'
import { SubmissionDetails } from '@/components/submission-details'

type PageType = 'dashboard' | 'info' | 'calculator' | 'admin' | 'submission'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const { isAuthenticated } = useAuth()
  const prevAuthenticated = useRef(false)

  useEffect(() => {
    if (isAuthenticated && !prevAuthenticated.current) {
      setCurrentPage('dashboard')
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    if (!isAuthenticated && prevAuthenticated.current) {
      setCurrentPage('dashboard')
    }
    prevAuthenticated.current = isAuthenticated
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={(page) => setCurrentPage(page as PageType)} />
      case 'info':
        return <InfoHub />
      case 'calculator':
        return <Calculator />
      case 'admin':
        return <AdminPanel />
      case 'submission':
        return <SubmissionDetails />
      default:
        return <Dashboard onNavigate={(page) => setCurrentPage(page as PageType)} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as PageType)} />
      <main>
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground tracking-widest">
            CHOREO SPOT — All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  )
}
