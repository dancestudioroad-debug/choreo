"use client"

import { useState, useRef, useEffect } from 'react'
import { 
  Save, 
  Plus, 
  Trash2, 
  FileText, 
  Megaphone, 
  HelpCircle, 
  Settings,
  Upload,
  Image as ImageIcon,
  FileAudio,
  Link,
  Calculator,
  X,
  Loader2,
  Video,
  MapPin,
  Lightbulb,
  Calendar,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useData } from '@/lib/data-context'
import { useAuth } from '@/lib/auth-context'

type TabId = 'content' | 'news' | 'faq' | 'media' | 'settings'

const tabs = [
  { id: 'content' as TabId, label: 'コンテンツ', icon: FileText },
  { id: 'news' as TabId, label: 'お知らせ', icon: Megaphone },
  { id: 'faq' as TabId, label: 'FAQ', icon: HelpCircle },
  { id: 'media' as TabId, label: 'メディア', icon: ImageIcon },
  { id: 'settings' as TabId, label: '設定', icon: Settings },
]

interface UploadState {
  uploading: boolean
  progress: number
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('content')
  const [uploadState, setUploadState] = useState<UploadState>({ uploading: false, progress: 0 })
  
  // Content states
  const [ownerMessage, setOwnerMessage] = useState('')
  const [stageInfo, setStageInfo] = useState('')
  const [lightingCanDoText, setLightingCanDoText] = useState('')
  const [lightingCannotDoText, setLightingCannotDoText] = useState('')
  const [lightingNotes, setLightingNotes] = useState('')
  const [eventDressingRoom, setEventDressingRoom] = useState('')
  const [eventRehearsal, setEventRehearsal] = useState('')
  const [eventFilmingRules, setEventFilmingRules] = useState('')
  const [eventTicketPickup, setEventTicketPickup] = useState('')
  const [eventOtherNotes, setEventOtherNotes] = useState('')
  const [eventOpening, setEventOpening] = useState('')
  const [venueInfo, setVenueInfo] = useState('')
  const [ticketInfo, setTicketInfo] = useState('')
  const [eventBestShow, setEventBestShow] = useState('')
  const [submissionDetails, setSubmissionDetails] = useState('')
  const [paymentExplanation, setPaymentExplanation] = useState('')
  
  // News states
  const [newNewsTitle, setNewNewsTitle] = useState('')
  const [newNewsContent, setNewNewsContent] = useState('')
  
  // FAQ states
  const [newFaqQuestion, setNewFaqQuestion] = useState('')
  const [newFaqAnswer, setNewFaqAnswer] = useState('')
  
  // Settings states
  const [googleDriveUrl, setGoogleDriveUrl] = useState('')
  const [guaranteeFee, setGuaranteeFee] = useState('')
  const [guaranteeFeeLabel, setGuaranteeFeeLabel] = useState('')
  
  // Performance fee breakdown editing
  const [newBreakdownLabel, setNewBreakdownLabel] = useState('')
  const [newBreakdownAmount, setNewBreakdownAmount] = useState('')
  const [editingBreakdownId, setEditingBreakdownId] = useState<string | null>(null)
  const [editBreakdownLabel, setEditBreakdownLabel] = useState('')
  const [editBreakdownAmount, setEditBreakdownAmount] = useState('')
  
  // Password states
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  
  // Media URL states
  const [stageDiagramUrl, setStageDiagramUrl] = useState('')
  const [lightingVideoUrl, setLightingVideoUrl] = useState('')
  const [lightingPdfUrl, setLightingPdfUrl] = useState('')
  const [lightingPdfLabel, setLightingPdfLabel] = useState('')
  const [venueImageUrl, setVenueImageUrl] = useState('')
  const [venueSeatChartUrl, setVenueSeatChartUrl] = useState('')
  const [venueImageCropX, setVenueImageCropX] = useState(50)
  const [venueImageCropY, setVenueImageCropY] = useState(50)
  const [venueImageCropZoom, setVenueImageCropZoom] = useState(1)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentUploadCategory, setCurrentUploadCategory] = useState<string>('other')
  
  const { userPassword, adminPassword, updateUserPassword, updateAdminPassword } = useAuth()
  
  const { 
    data, 
    updateOwnerMessage, 
    addNews, 
    deleteNews, 
    addFaq, 
    deleteFaq,
    updateStageInfo,
    updateStageDiagramUrl,
    updateLightingCanDo,
    updateLightingCannotDo,
    updateLightingSampleVideoUrl,
    updateLightingSamplePdfUrl,
    updateLightingSamplePdfLabel,
    updateLightingNotes,
    updateEventDressingRoom,
    updateEventRehearsal,
    updateEventFilmingRules,
    updateEventTicketPickup,
    updateEventOtherNotes,
    updateEventOpening,
    updateVenueInfo,
    updateVenueImageUrl,
    updateVenueImageCrop,
    updateVenueSeatChartUrl,
    updateTicketInfo,
    updateEventBestShow,
    updateSubmissionDetails,
    updatePaymentExplanation,
    updateGoogleDriveUrl,
    addPerformanceFeeItem,
    deletePerformanceFeeItem,
    updatePerformanceFeeItem,
    updateGuaranteeSettings,
    addMedia,
    deleteMedia
  } = useData()

  // Initialize states with current data
  useEffect(() => {
    setOwnerMessage(data.ownerMessage)
    setStageInfo(data.stageInfo)
    setLightingCanDoText(data.lightingCanDo.join('\n'))
    setLightingCannotDoText(data.lightingCannotDo.join('\n'))
    setLightingNotes(data.lightingNotes)
    setEventDressingRoom(data.eventDressingRoom)
    setEventRehearsal(data.eventRehearsal)
    setEventFilmingRules(data.eventFilmingRules)
    setEventTicketPickup(data.eventTicketPickup)
    setEventOtherNotes(data.eventOtherNotes)
    setEventOpening(data.eventOpening)
    setVenueInfo(data.venueInfo)
    setTicketInfo(data.ticketInfo)
    setEventBestShow(data.eventBestShow)
    setSubmissionDetails(data.submissionDetails)
    setPaymentExplanation(data.paymentExplanation)
    setGoogleDriveUrl(data.googleDriveUrl)
    setGuaranteeFee(data.guaranteePerPerson.toString())
    setGuaranteeFeeLabel(data.guaranteeLabel)
    setStageDiagramUrl(data.stageDiagramUrl)
    setLightingVideoUrl(data.lightingSampleVideoUrl)
    setLightingPdfUrl(data.lightingSamplePdfUrl)
    setLightingPdfLabel(data.lightingSamplePdfLabel)
    setVenueImageUrl(data.venueImageUrl)
    setVenueSeatChartUrl(data.venueSeatChartUrl)
    setVenueImageCropX(data.venueImageCrop.x)
    setVenueImageCropY(data.venueImageCrop.y)
    setVenueImageCropZoom(data.venueImageCrop.zoom)
  }, [data])

  const handleSaveContent = (type: string) => {
    switch (type) {
      case 'owner':
        updateOwnerMessage(ownerMessage)
        break
      case 'stage':
        updateStageInfo(stageInfo)
        break
      case 'stageDiagram':
        updateStageDiagramUrl(stageDiagramUrl)
        break
      case 'lightingCanDo':
        updateLightingCanDo(lightingCanDoText.split('\n').filter(s => s.trim()))
        break
      case 'lightingCannotDo':
        updateLightingCannotDo(lightingCannotDoText.split('\n').filter(s => s.trim()))
        break
      case 'lightingNotes':
        updateLightingNotes(lightingNotes)
        break
      case 'lightingVideo':
        updateLightingSampleVideoUrl(lightingVideoUrl)
        break
      case 'lightingPdf':
        updateLightingSamplePdfUrl(lightingPdfUrl)
        break
      case 'lightingPdfLabel':
        updateLightingSamplePdfLabel(lightingPdfLabel)
        break
      case 'dressingRoom':
        updateEventDressingRoom(eventDressingRoom)
        break
      case 'rehearsal':
        updateEventRehearsal(eventRehearsal)
        break
      case 'filmingRules':
        updateEventFilmingRules(eventFilmingRules)
        break
      case 'ticketPickup':
        updateEventTicketPickup(eventTicketPickup)
        break
      case 'otherNotes':
        updateEventOtherNotes(eventOtherNotes)
        break
      case 'opening':
        updateEventOpening(eventOpening)
        break
      case 'venue':
        updateVenueInfo(venueInfo)
        break
      case 'venueImage':
        updateVenueImageUrl(venueImageUrl)
        break
      case 'venueImageCrop':
        updateVenueImageCrop({
          x: venueImageCropX,
          y: venueImageCropY,
          zoom: venueImageCropZoom,
        })
        break
      case 'venueSeatChart':
        updateVenueSeatChartUrl(venueSeatChartUrl)
        break
      case 'ticket':
        updateTicketInfo(ticketInfo)
        break
      case 'bestShow':
        updateEventBestShow(eventBestShow)
        break
      case 'submission':
        updateSubmissionDetails(submissionDetails)
        break
      case 'payment':
        updatePaymentExplanation(paymentExplanation)
        break
    }
    alert('保存しました')
  }

  const handleAddNews = () => {
    if (newNewsTitle && newNewsContent) {
      addNews({
        title: newNewsTitle,
        content: newNewsContent,
        date: new Date().toISOString().split('T')[0]
      })
      setNewNewsTitle('')
      setNewNewsContent('')
    }
  }

  const handleAddFaq = () => {
    if (newFaqQuestion && newFaqAnswer) {
      addFaq({
        question: newFaqQuestion,
        answer: newFaqAnswer
      })
      setNewFaqQuestion('')
      setNewFaqAnswer('')
    }
  }

  const handleSaveSettings = () => {
    updateGoogleDriveUrl(googleDriveUrl)
    updateGuaranteeSettings(
      parseInt(guaranteeFee) || data.guaranteePerPerson,
      guaranteeFeeLabel || data.guaranteeLabel
    )
    alert('設定を保存しました')
  }

  const handleAddBreakdownItem = () => {
    if (newBreakdownLabel && newBreakdownAmount) {
      addPerformanceFeeItem({
        label: newBreakdownLabel,
        amountPerPerson: parseInt(newBreakdownAmount) || 0
      })
      setNewBreakdownLabel('')
      setNewBreakdownAmount('')
    }
  }

  const handleStartEditBreakdown = (item: { id: string; label: string; amountPerPerson: number }) => {
    setEditingBreakdownId(item.id)
    setEditBreakdownLabel(item.label)
    setEditBreakdownAmount(item.amountPerPerson.toString())
  }

  const handleSaveEditBreakdown = (id: string) => {
    updatePerformanceFeeItem(id, {
      label: editBreakdownLabel,
      amountPerPerson: parseInt(editBreakdownAmount) || 0
    })
    setEditingBreakdownId(null)
  }

  const handleSavePasswords = () => {
    if (newUserPassword) {
      updateUserPassword(newUserPassword)
    }
    if (newAdminPassword) {
      updateAdminPassword(newAdminPassword)
    }
    setNewUserPassword('')
    setNewAdminPassword('')
    alert('パスワードを更新しました')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadState({ uploading: true, progress: 0 })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || 'Upload failed')
      }
      
      // Update the appropriate URL based on category
      switch (category) {
        case 'stage':
          setStageDiagramUrl(result.url)
          updateStageDiagramUrl(result.url)
          break
        case 'lighting-video':
          setLightingVideoUrl(result.url)
          updateLightingSampleVideoUrl(result.url)
          break
        case 'lighting-pdf':
          setLightingPdfUrl(result.url)
          updateLightingSamplePdfUrl(result.url)
          break
        case 'venue':
          setVenueImageUrl(result.url)
          updateVenueImageUrl(result.url)
          break
        case 'venue-seat':
          setVenueSeatChartUrl(result.url)
          updateVenueSeatChartUrl(result.url)
          break
        default:
          addMedia({
            url: result.url,
            type: result.type,
            name: result.name,
            category: category as 'stage' | 'lighting' | 'venue' | 'other'
          })
      }

      alert('アップロード完了')
    } catch (error) {
      console.error('Upload error:', error)
      alert(`アップロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setUploadState({ uploading: false, progress: 0 })
      if (e.target) e.target.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-sm text-accent text-xs font-medium mb-4">
            <Settings className="w-3 h-3" />
            管理者モード
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-2">
            管理画面
          </h1>
          <p className="text-muted-foreground">
            コンテンツの編集、お知らせの投稿、メディアのアップロード
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors
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
            })}
          </div>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Owner Message */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">オーナーメッセージ</CardTitle>
                <CardDescription>ダッシュボードに表示されるメッセージを編集</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={ownerMessage}
                  onChange={(e) => setOwnerMessage(e.target.value)}
                  rows={8}
                  className="bg-muted border-border text-foreground"
                  placeholder="オーナーからのメッセージを入力..."
                />
                <Button onClick={() => handleSaveContent('owner')} className="bg-foreground text-background hover:bg-foreground/90">
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </CardContent>
            </Card>

            {/* Stage Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5" />
                  ステージ情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">ステージ説明テキスト</label>
                  <Textarea
                    value={stageInfo}
                    onChange={(e) => setStageInfo(e.target.value)}
                    rows={6}
                    className="bg-muted border-border text-foreground"
                  />
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('stage')}>保存</Button>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">ステージ図面（画像URL または アップロード）</label>
                  <div className="flex gap-2">
                    <Input
                      value={stageDiagramUrl}
                      onChange={(e) => setStageDiagramUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-muted border-border text-foreground flex-1"
                    />
                    <Button size="sm" variant="outline" onClick={() => handleSaveContent('stageDiagram')}>保存</Button>
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'stage')}
                      className="text-sm text-muted-foreground"
                    />
                  </div>
                  {stageDiagramUrl && (
                    <div className="mt-2 p-2 bg-muted rounded-sm">
                      <p className="text-xs text-muted-foreground truncate">{stageDiagramUrl}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lighting Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Lightbulb className="w-5 h-5" />
                  照明情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">できること（1行に1項目）</label>
                    <Textarea
                      value={lightingCanDoText}
                      onChange={(e) => setLightingCanDoText(e.target.value)}
                      rows={6}
                      className="bg-muted border-border text-foreground"
                      placeholder="基本照明の色変更&#10;スポットライト使用&#10;..."
                    />
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('lightingCanDo')}>保存</Button>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">できないこと（1行に1項目）</label>
                    <Textarea
                      value={lightingCannotDoText}
                      onChange={(e) => setLightingCannotDoText(e.target.value)}
                      rows={6}
                      className="bg-muted border-border text-foreground"
                      placeholder="レーザー照明&#10;火気を使用する演出&#10;..."
                    />
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('lightingCannotDo')}>保存</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">注意事項</label>
                  <Textarea
                    value={lightingNotes}
                    onChange={(e) => setLightingNotes(e.target.value)}
                    rows={4}
                    className="bg-muted border-border text-foreground"
                  />
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('lightingNotes')}>保存</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">サンプル動画URL（YouTube/Vimeo対応）</label>
                    <Input
                      value={lightingVideoUrl}
                      onChange={(e) => setLightingVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-muted border-border text-foreground"
                    />
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('lightingVideo')}>保存</Button>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'lighting-video')}
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">サンプルPDF URL</label>
                    <Input
                      value={lightingPdfUrl}
                      onChange={(e) => setLightingPdfUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-muted border-border text-foreground"
                    />
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('lightingPdf')}>保存</Button>
                    <Input
                      value={lightingPdfLabel}
                      onChange={(e) => setLightingPdfLabel(e.target.value)}
                      placeholder="照明はこちら"
                      className="bg-muted border-border text-foreground mt-2"
                    />
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('lightingPdfLabel')}>表示文言を保存</Button>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'lighting-pdf')}
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Day Section */}
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
                    <AccordionTrigger className="text-foreground">控え室について</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <Textarea
                        value={eventDressingRoom}
                        onChange={(e) => setEventDressingRoom(e.target.value)}
                        rows={6}
                        className="bg-muted border-border text-foreground"
                      />
                      <Button size="sm" variant="outline" onClick={() => handleSaveContent('dressingRoom')}>保存</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="rehearsal" className="border-border">
                    <AccordionTrigger className="text-foreground">リハーサルについて</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <Textarea
                        value={eventRehearsal}
                        onChange={(e) => setEventRehearsal(e.target.value)}
                        rows={6}
                        className="bg-muted border-border text-foreground"
                      />
                      <Button size="sm" variant="outline" onClick={() => handleSaveContent('rehearsal')}>保存</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="filming" className="border-border">
                    <AccordionTrigger className="text-foreground">撮影ルール</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <Textarea
                        value={eventFilmingRules}
                        onChange={(e) => setEventFilmingRules(e.target.value)}
                        rows={6}
                        className="bg-muted border-border text-foreground"
                      />
                      <Button size="sm" variant="outline" onClick={() => handleSaveContent('filmingRules')}>保存</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tickets" className="border-border">
                    <AccordionTrigger className="text-foreground">チケット受け取り</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <Textarea
                        value={eventTicketPickup}
                        onChange={(e) => setEventTicketPickup(e.target.value)}
                        rows={6}
                        className="bg-muted border-border text-foreground"
                      />
                      <Button size="sm" variant="outline" onClick={() => handleSaveContent('ticketPickup')}>保存</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="other-notes" className="border-border">
                    <AccordionTrigger className="text-foreground">その他注意点</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <Textarea
                        value={eventOtherNotes}
                        onChange={(e) => setEventOtherNotes(e.target.value)}
                        rows={6}
                        className="bg-muted border-border text-foreground"
                      />
                      <Button size="sm" variant="outline" onClick={() => handleSaveContent('otherNotes')}>保存</Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Megaphone className="w-5 h-5" />
                  オープニング
                </CardTitle>
                <CardDescription>「出展者ガイド {'>'} オープニング」タブに表示される説明文を編集</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={eventOpening}
                  onChange={(e) => setEventOpening(e.target.value)}
                  rows={6}
                  className="bg-muted border-border text-foreground"
                />
                <Button size="sm" variant="outline" onClick={() => handleSaveContent('opening')}>保存</Button>
              </CardContent>
            </Card>

            {/* Venue Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5" />
                  会場情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">会場説明テキスト</label>
                  <Textarea
                    value={venueInfo}
                    onChange={(e) => setVenueInfo(e.target.value)}
                    rows={6}
                    className="bg-muted border-border text-foreground"
                  />
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('venue')}>保存</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">会場画像URL</label>
                    <Input
                      value={venueImageUrl}
                      onChange={(e) => setVenueImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-muted border-border text-foreground"
                    />
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => handleSaveContent('venueImage')}>保存</Button>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'venue')}
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                    {venueImageUrl && (
                      <div className="mt-3 p-3 border border-border rounded-sm bg-muted/40">
                        <p className="text-xs text-muted-foreground mb-2">表示トリミング（閲覧画面に反映）</p>
                        <div className="aspect-video w-full overflow-hidden rounded-sm border border-border bg-muted">
                          <img
                            src={venueImageUrl}
                            alt="会場画像プレビュー"
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: `${venueImageCropX}% ${venueImageCropY}%`,
                              transform: `scale(${venueImageCropZoom})`,
                            }}
                          />
                        </div>
                        <div className="space-y-2 mt-3">
                          <label className="text-xs text-muted-foreground block">横位置: {venueImageCropX}%</label>
                          <Input type="range" min="0" max="100" value={venueImageCropX} onChange={(e) => setVenueImageCropX(Number(e.target.value))} />
                          <label className="text-xs text-muted-foreground block">縦位置: {venueImageCropY}%</label>
                          <Input type="range" min="0" max="100" value={venueImageCropY} onChange={(e) => setVenueImageCropY(Number(e.target.value))} />
                          <label className="text-xs text-muted-foreground block">拡大: {venueImageCropZoom.toFixed(2)}x</label>
                          <Input type="range" min="1" max="2" step="0.01" value={venueImageCropZoom} onChange={(e) => setVenueImageCropZoom(Number(e.target.value))} />
                          <Button size="sm" variant="outline" onClick={() => handleSaveContent('venueImageCrop')}>トリミングを保存</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">チケット情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={ticketInfo}
                  onChange={(e) => setTicketInfo(e.target.value)}
                  rows={8}
                  className="bg-muted border-border text-foreground"
                />
                <Button size="sm" variant="outline" onClick={() => handleSaveContent('ticket')}>保存</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Award className="w-5 h-5" />
                  BEST SHOW
                </CardTitle>
                <CardDescription>「出展者ガイド {'>'} BEST SHOW」タブに表示される説明文を編集</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={eventBestShow}
                  onChange={(e) => setEventBestShow(e.target.value)}
                  rows={8}
                  className="bg-muted border-border text-foreground"
                />
                <Button size="sm" variant="outline" onClick={() => handleSaveContent('bestShow')}>保存</Button>
              </CardContent>
            </Card>

            {/* Submission Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">提出物についての詳細</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={submissionDetails}
                  onChange={(e) => setSubmissionDetails(e.target.value)}
                  rows={10}
                  className="bg-muted border-border text-foreground"
                />
                <Button size="sm" variant="outline" onClick={() => handleSaveContent('submission')}>保存</Button>
              </CardContent>
            </Card>

            {/* Payment Explanation */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">振込についての説明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={paymentExplanation}
                  onChange={(e) => setPaymentExplanation(e.target.value)}
                  rows={10}
                  className="bg-muted border-border text-foreground"
                />
                <Button size="sm" variant="outline" onClick={() => handleSaveContent('payment')}>保存</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">新規お知らせ投稿</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="タイトル"
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                  className="bg-muted border-border text-foreground"
                />
                <Textarea
                  placeholder="内容（リンクを含めることができます）"
                  value={newNewsContent}
                  onChange={(e) => setNewNewsContent(e.target.value)}
                  rows={4}
                  className="bg-muted border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  URLを入力すると自動的にクリック可能なリンクになります
                </p>
                <Button 
                  onClick={handleAddNews} 
                  className="bg-foreground text-background hover:bg-foreground/90"
                  disabled={!newNewsTitle || !newNewsContent}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  投稿
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">投稿済みお知らせ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.news.map(item => (
                    <div key={item.id} className="flex items-start justify-between p-4 bg-muted rounded-sm">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">{item.date}</span>
                        </div>
                        <h4 className="font-medium text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteNews(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">新規FAQ追加</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="質問"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  className="bg-muted border-border text-foreground"
                />
                <Textarea
                  placeholder="回答（リンクを含めることができます）"
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  rows={3}
                  className="bg-muted border-border text-foreground"
                />
                <Button 
                  onClick={handleAddFaq}
                  className="bg-foreground text-background hover:bg-foreground/90"
                  disabled={!newFaqQuestion || !newFaqAnswer}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  追加
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">登録済みFAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.faqs.map(faq => (
                    <div key={faq.id} className="flex items-start justify-between p-4 bg-muted rounded-sm">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteFaq(faq.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">メディアアップロード</CardTitle>
                <CardDescription>
                  アップロードしたメディアは各セクションで使用できます。
                  コンテンツタブで各セクションのURL欄に直接アップロードすることもできます。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">ステージ図面</label>
                    <div className="border-2 border-dashed border-border rounded-sm p-4 text-center">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, 'stage')}
                        className="text-sm text-muted-foreground"
                        disabled={uploadState.uploading}
                      />
                    </div>
                    {data.stageDiagramUrl && (
                      <p className="text-xs text-green-500 mt-1">アップロード済み</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">照明サンプル動画</label>
                    <div className="border-2 border-dashed border-border rounded-sm p-4 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'lighting-video')}
                        className="text-sm text-muted-foreground"
                        disabled={uploadState.uploading}
                      />
                    </div>
                    {data.lightingSampleVideoUrl && (
                      <p className="text-xs text-green-500 mt-1">アップロード済み</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">照明サンプルPDF</label>
                    <div className="border-2 border-dashed border-border rounded-sm p-4 text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'lighting-pdf')}
                        className="text-sm text-muted-foreground"
                        disabled={uploadState.uploading}
                      />
                    </div>
                    {data.lightingSamplePdfUrl && (
                      <p className="text-xs text-green-500 mt-1">アップロード済み</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">会場画像</label>
                    <div className="border-2 border-dashed border-border rounded-sm p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'venue')}
                        className="text-sm text-muted-foreground"
                        disabled={uploadState.uploading}
                      />
                    </div>
                    {data.venueImageUrl && (
                      <p className="text-xs text-green-500 mt-1">アップロード済み</p>
                    )}
                  </div>
                </div>

                {uploadState.uploading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>アップロード中...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Uploaded Media List */}
            {data.media.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">アップロード済みメディア</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.media.map(item => (
                      <div key={item.id} className="relative group">
                        <div className="aspect-square bg-muted rounded-sm overflow-hidden border border-border">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {item.type === 'video' && <Video className="w-8 h-8 text-muted-foreground" />}
                              {item.type === 'pdf' && <FileText className="w-8 h-8 text-muted-foreground" />}
                              {item.type === 'audio' && <FileAudio className="w-8 h-8 text-muted-foreground" />}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">{item.name}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive/20 text-destructive"
                          onClick={() => deleteMedia(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Link className="w-5 h-5" />
                  外部リンク設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Google Drive 共有フォルダURL
                  </label>
                  <Input
                    placeholder="https://drive.google.com/..."
                    value={googleDriveUrl}
                    onChange={(e) => setGoogleDriveUrl(e.target.value)}
                    className="bg-muted border-border text-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Fee Breakdown */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Calculator className="w-5 h-5" />
                  出演料の内訳
                </CardTitle>
                <CardDescription>
                  出演料の内訳項目を追加・編集します。各項目は1人あたりの金額で設定してください。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add new breakdown item */}
                <div className="p-4 border border-dashed border-border rounded-sm space-y-3">
                  <p className="text-sm font-medium text-foreground">新しい項目を追加</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="項目名（例: 基本出演料）"
                      value={newBreakdownLabel}
                      onChange={(e) => setNewBreakdownLabel(e.target.value)}
                      className="bg-muted border-border text-foreground"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="1人あたり金額（円）"
                        value={newBreakdownAmount}
                        onChange={(e) => setNewBreakdownAmount(e.target.value)}
                        className="bg-muted border-border text-foreground"
                      />
                      <Button
                        onClick={handleAddBreakdownItem}
                        disabled={!newBreakdownLabel || !newBreakdownAmount}
                        size="icon"
                        className="bg-foreground text-background shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Existing breakdown items */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">登録済み項目</p>
                  {data.performanceFeeBreakdown.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-3 bg-muted rounded-sm">
                      {editingBreakdownId === item.id ? (
                        <>
                          <Input
                            value={editBreakdownLabel}
                            onChange={(e) => setEditBreakdownLabel(e.target.value)}
                            className="bg-background border-border text-foreground flex-1"
                          />
                          <Input
                            type="number"
                            value={editBreakdownAmount}
                            onChange={(e) => setEditBreakdownAmount(e.target.value)}
                            className="bg-background border-border text-foreground w-32"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveEditBreakdown(item.id)}
                            className="bg-foreground text-background"
                          >
                            保存
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingBreakdownId(null)}
                          >
                            キャンセル
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-foreground">{item.label}</span>
                          <span className="text-muted-foreground font-mono">¥{item.amountPerPerson.toLocaleString()}/人</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEditBreakdown(item)}
                          >
                            編集
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deletePerformanceFeeItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                  {data.performanceFeeBreakdown.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      内訳項目がありません。上のフォームから追加してください。
                    </p>
                  )}
                </div>

                {/* Preview */}
                <div className="bg-muted/50 p-4 rounded-sm border border-border">
                  <p className="text-sm text-foreground font-medium mb-2">出演料合計プレビュー（5人の場合）:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {data.performanceFeeBreakdown.map(item => (
                      <li key={item.id}>{item.label}: 5名 × ¥{item.amountPerPerson.toLocaleString()} = ¥{(5 * item.amountPerPerson).toLocaleString()}</li>
                    ))}
                    <li className="font-medium text-foreground pt-2 border-t border-border">
                      出演料合計: ¥{(5 * data.performanceFeeBreakdown.reduce((sum, item) => sum + item.amountPerPerson, 0)).toLocaleString()}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Guarantee Settings */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">ギャランティー設定</CardTitle>
                <CardDescription>
                  振込合計金額 = 出演料合計 - ギャランティー として計算されます。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      表示名
                    </label>
                    <Input
                      placeholder="ギャランティー"
                      value={guaranteeFeeLabel}
                      onChange={(e) => setGuaranteeFeeLabel(e.target.value)}
                      className="bg-muted border-border text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      金額（1人あたり・円）
                    </label>
                    <Input
                      type="number"
                      placeholder="2000"
                      value={guaranteeFee}
                      onChange={(e) => setGuaranteeFee(e.target.value)}
                      className="bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                {/* Calculation preview */}
                <div className="bg-muted/50 p-4 rounded-sm border border-border">
                  <p className="text-sm text-foreground font-medium mb-2">計算プレビュー（5人の場合）:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>出演料合計: ¥{(5 * data.performanceFeeBreakdown.reduce((sum, item) => sum + item.amountPerPerson, 0)).toLocaleString()}</li>
                    <li>{guaranteeFeeLabel || 'ギャランティー'}: -¥{(5 * (parseInt(guaranteeFee) || data.guaranteePerPerson)).toLocaleString()}</li>
                    <li className="font-medium text-foreground pt-2 border-t border-border">
                      振込合計金額: ¥{(5 * data.performanceFeeBreakdown.reduce((sum, item) => sum + item.amountPerPerson, 0) - 5 * (parseInt(guaranteeFee) || data.guaranteePerPerson)).toLocaleString()}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">パスワード設定</CardTitle>
                <CardDescription>
                  出展者用と管理者用のログインパスワードを変更できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      出展者用パスワード
                    </label>
                    <Input
                      type="text"
                      placeholder="出展者用パスワード"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="bg-muted border-border text-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-1">現在: {userPassword}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      管理者用パスワード
                    </label>
                    <Input
                      type="text"
                      placeholder="管理者用パスワード"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="bg-muted border-border text-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-1">現在: {adminPassword}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleSavePasswords}
                  variant="outline"
                  disabled={!newUserPassword && !newAdminPassword}
                >
                  パスワードを更新
                </Button>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSaveSettings}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Save className="w-4 h-4 mr-2" />
              設定を保存
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
