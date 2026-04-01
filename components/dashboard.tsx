"use client"

import Image from 'next/image'
import { ExternalLink, Megaphone, Heart, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/lib/data-context'
import { LinkifyBlock } from '@/components/linkify-text'

interface DashboardProps {
  onNavigate: (page: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { data } = useData()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="mb-12 md:mb-16">
          <div className="relative">
            <div className="mb-4">
              <Image
                src="/choreo-spot-logo.png"
                alt="CHOREO SPOT ロゴ"
                width={200}
                height={148}
                className="h-auto w-[150px] md:w-[200px] opacity-80"
              />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground leading-none">
              WELCOME TO
              <br />
              <span className="text-foreground/30">CHOREO</span>
              <span className="text-foreground"> SPOT</span>
            </h1>
            <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-foreground/20" />
          </div>
        </section>

        {/* Owner Message */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-5 h-5 text-foreground" />
            <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground">
              主催からのメッセージ
            </h2>
          </div>
          <Card className="bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <LinkifyBlock 
                text={data.ownerMessage} 
                className="text-foreground/80 leading-relaxed text-sm md:text-base"
              />
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions - Submission Folder */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
            提出物
          </h2>
          <div className="space-y-4">
            <a
              href={data.googleDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="bg-card border-border hover:border-foreground/50 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-foreground rounded-sm flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">提出物フォルダ</h3>
                      <p className="text-sm text-muted-foreground">音源, 全体動画, アー写, 照明案等</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-border group-hover:border-foreground/50 flex items-center justify-center transition-colors">
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </a>

            <button onClick={() => onNavigate('submission')} className="text-left w-full">
              <Card className="bg-card border-border hover:border-foreground/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">提出物についての詳細</span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </CardContent>
              </Card>
            </button>

            <p className="text-sm text-muted-foreground text-center px-4 py-2 bg-muted/50 rounded-sm border border-border">
              必ずご確認の上、期限内に提出をお願いいたします。
            </p>
          </div>
        </section>

        {/* News Section */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="w-5 h-5 text-foreground" />
            <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground">
              News & Updates
            </h2>
          </div>
          <div className="space-y-3">
            {data.news.map((item) => (
              <Card key={item.id} className="bg-card border-border hover:border-foreground/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <LinkifyBlock text={item.content} className="text-sm text-muted-foreground line-clamp-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Navigation Cards */}
        <section>
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
            Explore
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <button onClick={() => onNavigate('info')} className="text-left group">
              <Card className="bg-card border-border hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">出展者ガイド</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    ステージ情報、照明案、当日の流れなど
                  </p>
                </CardContent>
              </Card>
            </button>

            <button onClick={() => onNavigate('calculator')} className="text-left group">
              <Card className="bg-card border-border hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">出演料・ギャランティ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    出演料内訳、振り込み方法など
                  </p>
                </CardContent>
              </Card>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
