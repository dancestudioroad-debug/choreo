"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X, LogOut, Settings, Home, BookOpen, Calculator, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'ホーム', icon: Home },
  { id: 'info', label: '出展者ガイド', icon: BookOpen },
  { id: 'calculator', label: '出演料・ギャランティ', icon: Calculator },
]

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { isAdmin, logout, toggleAdminMode } = useAuth()

  const handleNavClick = (page: string) => {
    onNavigate(page)
    setIsOpen(false)
  }

  return (
    <>
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2 group"
          >
            <Image
              src="/choreo-spot-logo.png"
              alt="CHOREO SPOT ロゴ"
              width={28}
              height={28}
              className="h-7 w-7 rounded-sm object-cover opacity-85"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tighter text-foreground leading-none">
              CHOREO SPOT
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-sm",
                  currentPage === item.id 
                    ? "bg-foreground text-background" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavClick('admin')}
                className={cn(
                  "hidden md:flex items-center gap-2",
                  currentPage === 'admin' && "bg-foreground text-background"
                )}
              >
                <Settings className="w-4 h-4" />
                管理画面
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
              title="ログアウト"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={cn(
        "fixed top-16 right-0 bottom-0 w-72 z-40 bg-background border-l border-border transform transition-transform duration-300 ease-out md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-sm transition-colors",
                  currentPage === item.id 
                    ? "bg-foreground text-background" 
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            )
          })}

          {isAdmin && (
            <>
              <div className="h-px bg-border my-4" />
              <button
                onClick={() => handleNavClick('admin')}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-sm transition-colors",
                  currentPage === 'admin' 
                    ? "bg-foreground text-background" 
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  管理画面
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors",
                  currentPage === item.id 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors",
                currentPage === 'admin' 
                  ? "text-foreground" 
                  : "text-muted-foreground"
              )}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-medium">管理</span>
            </button>
          )}
        </div>
      </nav>

      {/* Spacer for fixed bottom nav on mobile */}
      <div className="h-16 md:hidden" />
    </>
  )
}
