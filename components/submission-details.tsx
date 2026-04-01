"use client"

import { FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/lib/data-context'
import { LinkifyBlock } from '@/components/linkify-text'

export function SubmissionDetails() {
  const { data } = useData()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-2">
            提出物についての詳細
          </h1>
          <p className="text-muted-foreground">
            各種提出物の形式、締め切り、注意事項をご確認ください
          </p>
        </div>

        {/* Submission Details */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5" />
              提出物ガイド
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LinkifyBlock 
              text={data.submissionDetails} 
              className="text-foreground/80 leading-relaxed text-sm"
            />
          </CardContent>
        </Card>

        {/* Link to Google Drive */}
        <a
          href={data.googleDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
            <ExternalLink className="w-4 h-4 mr-2" />
            提出物フォルダを開く（Google Drive）
          </Button>
        </a>

        {/* Important Notice */}
        <div className="mt-6 p-4 bg-muted/50 rounded-sm border border-border">
          <p className="text-sm text-muted-foreground text-center">
            必ずご確認の上、期限内に提出をお願いいたします。
          </p>
        </div>
      </div>
    </div>
  )
}
