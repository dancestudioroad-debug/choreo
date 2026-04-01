"use client"

import { useState } from 'react'
import { Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'

export function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = login(password)
    if (!success) {
      setError('パスワードが正しくありません')
      setPassword('')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-muted/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-muted/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-2 leading-none">
            CHOREO SPOT
          </h1>
          <p className="mt-6 text-muted-foreground text-sm tracking-wide">
            ナンバー出展者専用ポータル
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="w-5 h-5" />
            </div>
            <Input
              type="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 pl-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-foreground/20 text-base"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 font-semibold text-base tracking-wide"
            disabled={isLoading || !password}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                確認中...
              </span>
            ) : (
              'ログイン'
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            当サイトのURL及びパスワードを第三者へ共有する事はお控えください
          </p>
        </form>

      </div>
    </div>
  )
}
