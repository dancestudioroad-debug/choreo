"use client"

import { useState } from 'react'
import { 
  Play, 
  Lightbulb, 
  MapPin, 
  Calendar, 
  HelpCircle,
  Check,
  X,
  FileText,
  Ticket,
  ExternalLink,
  Megaphone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useData } from '@/lib/data-context'
import { LinkifyBlock } from '@/components/linkify-text'

type TabId = 'stage' | 'lighting' | 'event' | 'opening' | 'venue' | 'ticket' | 'faq'

const tabs = [
  { id: 'stage' as TabId, label: 'ステージ', icon: MapPin },
  { id: 'lighting' as TabId, label: '照明', icon: Lightbulb },
  { id: 'event' as TabId, label: '当日', icon: Calendar },
  { id: 'opening' as TabId, label: 'オープニング', icon: Megaphone },
  { id: 'venue' as TabId, label: '会場', icon: MapPin },
  { id: 'ticket' as TabId, label: 'チケット', icon: Ticket },
  { id: 'faq' as TabId, label: 'FAQ', icon: HelpCircle },
]

// Helper to check if URL is a YouTube/Vimeo URL
function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null
  
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return null
}

export function InfoHub() {
  const [activeTab, setActiveTab] = useState<TabId>('stage')
  const [isVenueImageOpen, setIsVenueImageOpen] = useState(false)
  const { data } = useData()

  const renderTabButton = (tab: (typeof tabs)[number]) => {
    const Icon = tab.icon
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`
          flex items-center justify-center gap-2 px-2 py-2.5 rounded-sm text-xs sm:text-sm font-medium transition-colors whitespace-nowrap
          ${activeTab === tab.id
            ? 'bg-foreground text-background'
            : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/50'
          }
        `}
      >
        <Icon className="w-4 h-4" />
        {tab.label}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-2">
            出展者ガイド
          </h1>
          <p className="text-muted-foreground">
            ステージ、照明、当日の流れなど、必要な情報をご確認ください
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {tabs.map(renderTabButton)}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Stage Info */}
          {activeTab === 'stage' && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-5 h-5" />
                    ステージ & バミリ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stage Info Text */}
                  <div className="bg-muted p-4 rounded-sm">
                    <LinkifyBlock 
                      text={data.stageInfo} 
                      className="text-foreground/80 leading-relaxed text-sm font-mono"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lighting Info */}
          {activeTab === 'lighting' && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Lightbulb className="w-5 h-5" />
                    照明案ガイド
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Description */}
                  <div className="text-foreground/80 text-sm">
                    <LinkifyBlock text={data.lightingInfo} />
                  </div>

                  {/* Can / Cannot Lists */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-sm border border-border">
                      <h4 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                        <Check className="w-4 h-4 text-green-500" />
                        できること
                      </h4>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        {data.lightingCanDo.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">+</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-sm border border-border">
                      <h4 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                        <X className="w-4 h-4 text-destructive" />
                        できないこと
                      </h4>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        {data.lightingCannotDo.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-destructive mt-0.5">-</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sample Video/PDF */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">照明サンプル</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Video Sample */}
                      {data.lightingSampleVideoUrl ? (
                        getVideoEmbedUrl(data.lightingSampleVideoUrl) ? (
                          <div className="aspect-video rounded-sm overflow-hidden border border-border">
                            <iframe
                              src={getVideoEmbedUrl(data.lightingSampleVideoUrl)!}
                              className="w-full h-full"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                        ) : (
                          <a 
                            href={data.lightingSampleVideoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="aspect-video bg-muted rounded-sm flex items-center justify-center border border-border group cursor-pointer hover:border-foreground/50 transition-colors"
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 mx-auto mb-2 bg-foreground/10 rounded-full flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                                <Play className="w-5 h-5 text-foreground ml-0.5" />
                              </div>
                              <p className="text-xs text-muted-foreground">動画を再生</p>
                            </div>
                          </a>
                        )
                      ) : (
                        <div className="aspect-video bg-muted rounded-sm flex items-center justify-center border border-border">
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-foreground/10 rounded-full flex items-center justify-center">
                              <Play className="w-5 h-5 text-muted-foreground ml-0.5" />
                            </div>
                            <p className="text-xs text-muted-foreground">サンプル動画</p>
                          </div>
                        </div>
                      )}

                      {/* PDF Sample */}
                      {data.lightingSamplePdfUrl ? (
                        <a 
                          href={data.lightingSamplePdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="aspect-video bg-muted rounded-sm flex items-center justify-center border border-border group cursor-pointer hover:border-foreground/50 transition-colors"
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-foreground/10 rounded-sm flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                              <FileText className="w-5 h-5 text-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">{data.lightingSamplePdfLabel || 'PDFを開く'}</p>
                            <ExternalLink className="w-3 h-3 mx-auto mt-1 text-muted-foreground" />
                          </div>
                        </a>
                      ) : (
                        <div className="aspect-video bg-muted rounded-sm flex items-center justify-center border border-border">
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-foreground/10 rounded-sm flex items-center justify-center">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">サンプルPDF</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notice */}
                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-sm">
                    <LinkifyBlock 
                      text={data.lightingNotes} 
                      className="text-sm text-foreground/80"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Event Details */}
          {activeTab === 'event' && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Calendar className="w-5 h-5" />
                    当日の詳細
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="dressing" className="border-border">
                      <AccordionTrigger className="text-foreground hover:text-foreground/80">
                        控え室について
                      </AccordionTrigger>
                      <AccordionContent>
                        <LinkifyBlock 
                          text={data.eventDressingRoom} 
                          className="text-foreground/80 text-sm"
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="rehearsal" className="border-border">
                      <AccordionTrigger className="text-foreground hover:text-foreground/80">
                        リハーサルについて
                      </AccordionTrigger>
                      <AccordionContent>
                        <LinkifyBlock 
                          text={data.eventRehearsal} 
                          className="text-foreground/80 text-sm"
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="filming" className="border-border">
                      <AccordionTrigger className="text-foreground hover:text-foreground/80">
                        撮影ルール
                      </AccordionTrigger>
                      <AccordionContent>
                        <LinkifyBlock 
                          text={data.eventFilmingRules} 
                          className="text-foreground/80 text-sm"
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tickets" className="border-border">
                      <AccordionTrigger className="text-foreground hover:text-foreground/80">
                        チケット受け取り
                      </AccordionTrigger>
                      <AccordionContent>
                        <LinkifyBlock 
                          text={data.eventTicketPickup} 
                          className="text-foreground/80 text-sm"
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="other-notes" className="border-border">
                      <AccordionTrigger className="text-foreground hover:text-foreground/80">
                        その他注意点
                      </AccordionTrigger>
                      <AccordionContent>
                        <LinkifyBlock
                          text={data.eventOtherNotes}
                          className="text-foreground/80 text-sm"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Opening */}
          {activeTab === 'opening' && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Megaphone className="w-5 h-5" />
                    オープニング
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <LinkifyBlock
                    text={data.eventOpening}
                    className="text-foreground/80 leading-relaxed text-sm"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Venue Info */}
          {activeTab === 'venue' && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-5 h-5" />
                    会場情報
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Venue Image */}
                  {data.venueImageUrl ? (
                    <button
                      type="button"
                      onClick={() => setIsVenueImageOpen(true)}
                      className="aspect-video w-full bg-muted rounded-sm overflow-hidden border border-border"
                    >
                      <img 
                        src={data.venueImageUrl} 
                        alt="会場画像" 
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: `${data.venueImageCrop.x}% ${data.venueImageCrop.y}%`,
                          transform: `scale(${data.venueImageCrop.zoom})`,
                        }}
                      />
                    </button>
                  ) : null}

                  {/* Venue Details */}
                  <LinkifyBlock 
                    text={data.venueInfo} 
                    className="text-foreground/80 leading-relaxed text-sm"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ticket Info */}
          {activeTab === 'ticket' && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Ticket className="w-5 h-5" />
                    チケット情報
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <LinkifyBlock 
                    text={data.ticketInfo} 
                    className="text-foreground/80 leading-relaxed text-sm"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <HelpCircle className="w-5 h-5" />
                    よくある質問
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {data.faqs.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`faq-${index}`} className="border-border">
                        <AccordionTrigger className="text-foreground hover:text-foreground/80 text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <LinkifyBlock 
                            text={faq.answer} 
                            className="text-foreground/80"
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom Tab Navigation */}
        <div className="mt-10 pt-6 border-t border-border">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {tabs.map(renderTabButton)}
          </div>
        </div>
      </div>
      {isVenueImageOpen && data.venueImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsVenueImageOpen(false)}
        >
          <img
            src={data.venueImageUrl}
            alt="会場画像拡大"
            className="max-w-full max-h-full object-contain rounded-sm"
          />
        </div>
      )}
    </div>
  )
}
