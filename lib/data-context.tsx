"use client"

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

interface NewsItem {
  id: string
  title: string
  content: string
  date: string
}

interface FAQ {
  id: string
  question: string
  answer: string
}

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video' | 'pdf' | 'audio'
  name: string
  category: 'stage' | 'lighting' | 'venue' | 'other'
}

interface PerformanceFeeBreakdown {
  id: string
  label: string
  amountPerPerson: number
}

interface SiteData {
  // Owner & News
  ownerMessage: string
  news: NewsItem[]
  faqs: FAQ[]
  
  // Stage Info
  stageInfo: string
  stageDiagramUrl: string
  
  // Lighting Info
  lightingInfo: string
  lightingCanDo: string[]
  lightingCannotDo: string[]
  lightingSampleVideoUrl: string
  lightingSamplePdfUrl: string
  lightingSamplePdfLabel: string
  lightingNotes: string
  
  // Event Day Details - separate fields for each accordion
  eventDressingRoom: string
  eventRehearsal: string
  eventFilmingRules: string
  eventTicketPickup: string
  eventOtherNotes: string
  eventOpening: string
  
  // Venue Info
  venueInfo: string
  venueImageUrl: string
  venueSeatChartUrl: string
  venueImageCrop: {
    x: number
    y: number
    zoom: number
  }
  
  // Ticket Info
  ticketInfo: string
  
  // Submission Info
  submissionDetails: string
  
  // Payment Info
  paymentExplanation: string
  
  // Settings
  googleDriveUrl: string

  /** 出展者ログイン用（Supabase site_content と同期） */
  userPassword: string
  /** 管理者ログイン用（Supabase site_content と同期） */
  adminPassword: string
  
  // Calculator settings - 出演料の内訳 (複数項目)
  performanceFeeBreakdown: PerformanceFeeBreakdown[]
  guaranteePerPerson: number
  guaranteeLabel: string
  
  // Media items
  media: MediaItem[]
}

interface DataContextType {
  data: SiteData
  updateOwnerMessage: (message: string) => void
  addNews: (news: Omit<NewsItem, 'id'>) => void
  deleteNews: (id: string) => void
  addFaq: (faq: Omit<FAQ, 'id'>) => void
  deleteFaq: (id: string) => void
  updateFaq: (id: string, faq: Omit<FAQ, 'id'>) => void
  
  // Stage
  updateStageInfo: (info: string) => void
  updateStageDiagramUrl: (url: string) => void
  
  // Lighting
  updateLightingInfo: (info: string) => void
  updateLightingCanDo: (items: string[]) => void
  updateLightingCannotDo: (items: string[]) => void
  updateLightingSampleVideoUrl: (url: string) => void
  updateLightingSamplePdfUrl: (url: string) => void
  updateLightingSamplePdfLabel: (label: string) => void
  updateLightingNotes: (notes: string) => void
  
  // Event Day
  updateEventDressingRoom: (info: string) => void
  updateEventRehearsal: (info: string) => void
  updateEventFilmingRules: (info: string) => void
  updateEventTicketPickup: (info: string) => void
  updateEventOtherNotes: (info: string) => void
  updateEventOpening: (info: string) => void
  
  // Venue
  updateVenueInfo: (info: string) => void
  updateVenueImageUrl: (url: string) => void
  updateVenueSeatChartUrl: (url: string) => void
  updateVenueImageCrop: (crop: { x: number; y: number; zoom: number }) => void
  
  // Ticket
  updateTicketInfo: (info: string) => void
  
  // Submission
  updateSubmissionDetails: (details: string) => void
  
  // Payment
  updatePaymentExplanation: (explanation: string) => void
  
  // Settings
  updateGoogleDriveUrl: (url: string) => void
  updatePerformanceFeeBreakdown: (items: PerformanceFeeBreakdown[]) => void
  addPerformanceFeeItem: (item: Omit<PerformanceFeeBreakdown, 'id'>) => void
  deletePerformanceFeeItem: (id: string) => void
  updatePerformanceFeeItem: (id: string, item: Omit<PerformanceFeeBreakdown, 'id'>) => void
  updateGuaranteeSettings: (amount: number, label: string) => void

  updatePersistedUserPassword: (password: string) => void
  updatePersistedAdminPassword: (password: string) => void
  
  // Media
  addMedia: (media: Omit<MediaItem, 'id'>) => void
  deleteMedia: (id: string) => void
}

const defaultData: SiteData = {
  ownerMessage: `CHOREO SPOT へようこそ。

このイベントは、振付師（コレオグラファー）一人ひとりの「表現」を最大限に輝かせる場所として生まれました。

ストリートダンスの原点である「自己表現」と「コミュニティ」を大切にしながら、観客とダンサーが一体となれる空間を目指しています。

あなたの作品が、誰かの人生を変えるかもしれない。
そんな瞬間を、一緒に作りましょう。`,

  news: [
    {
      id: '1',
      title: '音源提出締め切りのお知らせ',
      content: '音源提出の締め切りは2024年12月15日（日）23:59です。期限厳守でお願いいたします。',
      date: '2024-11-20'
    },
    {
      id: '2',
      title: 'リハーサルスケジュール公開',
      content: '当日のリハーサルスケジュールを公開しました。「当日の詳細」セクションよりご確認ください。',
      date: '2024-11-15'
    }
  ],

  faqs: [
    {
      id: '1',
      question: '音源のファイル形式は何が使えますか？',
      answer: 'MP3形式（320kbps以上推奨）、WAV形式に対応しています。ファイル名は「ナンバー名_代表者名」としてください。'
    },
    {
      id: '2',
      question: 'ナンバーの出演人数に制限はありますか？',
      answer: '安全面を考慮し、1ナンバーあたり最大20名までとさせていただいております。'
    },
    {
      id: '3',
      question: '衣装の持ち込みは可能ですか？',
      answer: 'はい、可能です。控え室に更衣スペースをご用意しておりますので、ご利用ください。'
    }
  ],

  stageInfo: `【ステージサイズ】
幅: 10m / 奥行き: 8m / 高さ: 4m

【バミリについて】
・センターマーク: 白テープ
・サイドマーク: 各2m間隔で設置
・前方ライン: ステージ前端から1m

※詳細な図面は下記をご確認ください。`,

  stageDiagramUrl: '',

  lightingInfo: `照明案の提出がない場合は、お任せとなります。`,

  lightingCanDo: [
    '基本照明の色変更（RGB対応）',
    'スポットライト使用（最大3台）',
    'フェードイン/フェードアウト',
    'ブラックアウト',
    'ストロボ使用（事前申請必須）'
  ],

  lightingCannotDo: [
    'レーザー照明',
    '火気を使用する演出',
    '観客席への強い光の照射',
    'スモークマシン（会場規定により）'
  ],

  lightingSampleVideoUrl: '',
  lightingSamplePdfUrl: '',
  lightingSamplePdfLabel: 'PDFを開く',

  lightingNotes: `【注意事項】
・照明プランは本番2週間前までにご提出ください
・当日の変更は原則お受けできません
・複雑な演出をご希望の場合は事前打ち合わせをお願いします`,

  eventDressingRoom: `【控え室について】
・各ナンバーごとに専用スペースを用意
・更衣室は男女別で完備
・荷物置き場あり（貴重品は各自管理）
・メイクスペースは共用となります
・飲食は控え室内のみ可能です`,

  eventRehearsal: `【リハーサルスケジュール】
・本番前日: 場当たり（各ナンバー15分）
・当日: 音響チェック（各ナンバー5分）
・リハーサル順は本番の逆順で行います
・時間厳守でお願いします`,

  eventFilmingRules: `【撮影ルール】
・公式カメラマンによる撮影あり
・個人での動画撮影は禁止
・写真撮影は静音モードでの撮影のみ可
・公式映像は後日共有します

【SNS投稿について】
・公式写真は自由にお使いいただけます
・動画の投稿は公式映像のみ許可
・ハッシュタグ #CHOREOSPOT をご使用ください`,

  eventTicketPickup: `【取り置きチケット受け取り】
・受付で代表者のお名前をお伝えください
・本人確認書類が必要な場合があります
・開演30分前までにお越しください

【取り置き方法】
・Google Driveの取り置きリストに記入
・締め切り: 本番1週間前`,

  eventOtherNotes: `【その他注意点】
・集合時間に遅れないよう、余裕を持ってご来場ください
・体調不良の場合は無理をせず、必ず運営へご連絡ください
・貴重品は自己管理を徹底してください`,

  eventOpening: `【オープニングについて】
・オープニング演出は開演直前に実施します
・出演者集合時間は別途共有される案内をご確認ください
・立ち位置と導線は当日スタッフの指示に従ってください`,

  venueInfo: `【会場】
ダンススタジオ GROOVE HALL
〒150-0001 東京都渋谷区神宮前X-XX-X

【アクセス】
・JR山手線「原宿駅」徒歩7分
・東京メトロ千代田線「明治神宮前駅」徒歩5分

【座席数】
全席自由席: 200席`,

  venueImageUrl: '',
  venueSeatChartUrl: '',
  venueImageCrop: { x: 50, y: 50, zoom: 1 },

  ticketInfo: `【チケット料金】
・前売りチケット: 2,500円
・当日チケット: 3,000円

【取り置きについて】
・各ナンバーにつき最大10枚まで取り置き可能
・取り置き依頼は本番1週間前まで
・取り置きリストは別途Google Driveで管理

【販売方法】
・オンライン販売: Peatixにて販売
・当日券: 会場受付にて現金払いのみ

【出演者特典】
・出演者本人は無料入場`,

  submissionDetails: `【音源提出】
・形式: MP3（320kbps以上）またはWAV
・ファイル名: 「ナンバー名_代表者名」
・締め切り: 本番2週間前

【全体動画】
・形式: MP4（1080p推奨）
・内容: 本番と同じ構成の通し動画
・締め切り: 本番1週間前

【アー写（アーティスト写真）】
・形式: JPGまたはPNG（高解像度）
・用途: 公式パンフレット、SNS告知
・締め切り: 本番3週間前

【照明案】
・形式: PDF、画像、またはテキスト
・内容: 色、タイミング、演出希望など
・締め切り: 本番2週間前`,

  paymentExplanation: `【振込について】
イベント終了後、2週間以内にご���定の銀行口座へお振込みいたします。

【振込スケジュール】
・集計期間: イベント終了後〜3日以内
・振込手続き: 集計完了後〜1週間以内
・着金予定: 振込手続き後〜3営業日以内

【必要な情報】
事前に以下の情報をGoogle Driveの指定フォルダにご提出ください:
・銀行名
・支店名
・口座種別（普通/当座）
・口座番号
・口座名義（カタカナ）

【注意事項】
・振込手数料は運営側で負担いたします
・海外口座への振込は対応しておりません`,

  googleDriveUrl: 'https://drive.google.com/drive/folders/example',

  userPassword: 'choreo2024',
  adminPassword: 'admin2024',

  // Calculator - 出演料内訳（複数項目）
  performanceFeeBreakdown: [
    { id: '1', label: '基本出演料', amountPerPerson: 1000 },
    { id: '2', label: '衣装・メイク協力費', amountPerPerson: 500 },
    { id: '3', label: 'リハーサル参加費', amountPerPerson: 300 },
  ],
  guaranteePerPerson: 2000,
  guaranteeLabel: 'ギャランティー',

  media: []
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData)
  const [hasLoadedRemote, setHasLoadedRemote] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const loadRemoteData = async () => {
      try {
        const response = await fetch('/api/site-data', { cache: 'no-store' })
        if (!response.ok) return

        const result = await response.json()
        if (result?.payload && typeof result.payload === 'object') {
          setData((prev) => {
            const merged = { ...prev, ...result.payload } as SiteData
            if (typeof localStorage !== 'undefined') {
              const legacyUser = localStorage.getItem('choreo-user-password')
              const legacyAdmin = localStorage.getItem('choreo-admin-password')
              if (legacyUser && !('userPassword' in (result.payload as object))) {
                merged.userPassword = legacyUser
              }
              if (legacyAdmin && !('adminPassword' in (result.payload as object))) {
                merged.adminPassword = legacyAdmin
              }
            }
            if (typeof merged.userPassword !== 'string' || !merged.userPassword) {
              merged.userPassword = prev.userPassword
            }
            if (typeof merged.adminPassword !== 'string' || !merged.adminPassword) {
              merged.adminPassword = prev.adminPassword
            }
            return merged
          })
        }
      } catch (error) {
        console.error('Failed to load remote site data:', error)
      } finally {
        setHasLoadedRemote(true)
      }
    }

    void loadRemoteData()
  }, [])

  useEffect(() => {
    if (!hasLoadedRemote) return

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(() => {
      void fetch('/api/site-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: data }),
      }).catch((error) => {
        console.error('Failed to persist site data:', error)
      })
    }, 350)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [data, hasLoadedRemote])

  const updateOwnerMessage = (message: string) => {
    setData(prev => ({ ...prev, ownerMessage: message }))
  }

  const addNews = (news: Omit<NewsItem, 'id'>) => {
    const newItem = { ...news, id: Date.now().toString() }
    setData(prev => ({ ...prev, news: [newItem, ...prev.news] }))
  }

  const deleteNews = (id: string) => {
    setData(prev => ({ ...prev, news: prev.news.filter(n => n.id !== id) }))
  }

  const addFaq = (faq: Omit<FAQ, 'id'>) => {
    const newItem = { ...faq, id: Date.now().toString() }
    setData(prev => ({ ...prev, faqs: [...prev.faqs, newItem] }))
  }

  const deleteFaq = (id: string) => {
    setData(prev => ({ ...prev, faqs: prev.faqs.filter(f => f.id !== id) }))
  }

  const updateFaq = (id: string, faq: Omit<FAQ, 'id'>) => {
    setData(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === id ? { ...faq, id } : f)
    }))
  }

  // Stage
  const updateStageInfo = (info: string) => {
    setData(prev => ({ ...prev, stageInfo: info }))
  }

  const updateStageDiagramUrl = (url: string) => {
    setData(prev => ({ ...prev, stageDiagramUrl: url }))
  }

  // Lighting
  const updateLightingInfo = (info: string) => {
    setData(prev => ({ ...prev, lightingInfo: info }))
  }

  const updateLightingCanDo = (items: string[]) => {
    setData(prev => ({ ...prev, lightingCanDo: items }))
  }

  const updateLightingCannotDo = (items: string[]) => {
    setData(prev => ({ ...prev, lightingCannotDo: items }))
  }

  const updateLightingSampleVideoUrl = (url: string) => {
    setData(prev => ({ ...prev, lightingSampleVideoUrl: url }))
  }

  const updateLightingSamplePdfUrl = (url: string) => {
    setData(prev => ({ ...prev, lightingSamplePdfUrl: url }))
  }

  const updateLightingSamplePdfLabel = (label: string) => {
    setData(prev => ({ ...prev, lightingSamplePdfLabel: label }))
  }

  const updateLightingNotes = (notes: string) => {
    setData(prev => ({ ...prev, lightingNotes: notes }))
  }

  // Event Day
  const updateEventDressingRoom = (info: string) => {
    setData(prev => ({ ...prev, eventDressingRoom: info }))
  }

  const updateEventRehearsal = (info: string) => {
    setData(prev => ({ ...prev, eventRehearsal: info }))
  }

  const updateEventFilmingRules = (info: string) => {
    setData(prev => ({ ...prev, eventFilmingRules: info }))
  }

  const updateEventTicketPickup = (info: string) => {
    setData(prev => ({ ...prev, eventTicketPickup: info }))
  }

  const updateEventOtherNotes = (info: string) => {
    setData(prev => ({ ...prev, eventOtherNotes: info }))
  }

  const updateEventOpening = (info: string) => {
    setData(prev => ({ ...prev, eventOpening: info }))
  }

  // Venue
  const updateVenueInfo = (info: string) => {
    setData(prev => ({ ...prev, venueInfo: info }))
  }

  const updateVenueImageUrl = (url: string) => {
    setData(prev => ({ ...prev, venueImageUrl: url }))
  }

  const updateVenueSeatChartUrl = (url: string) => {
    setData(prev => ({ ...prev, venueSeatChartUrl: url }))
  }

  const updateVenueImageCrop = (crop: { x: number; y: number; zoom: number }) => {
    setData(prev => ({ ...prev, venueImageCrop: crop }))
  }

  // Ticket
  const updateTicketInfo = (info: string) => {
    setData(prev => ({ ...prev, ticketInfo: info }))
  }

  // Submission
  const updateSubmissionDetails = (details: string) => {
    setData(prev => ({ ...prev, submissionDetails: details }))
  }

  // Payment
  const updatePaymentExplanation = (explanation: string) => {
    setData(prev => ({ ...prev, paymentExplanation: explanation }))
  }

  // Settings
  const updateGoogleDriveUrl = (url: string) => {
    setData(prev => ({ ...prev, googleDriveUrl: url }))
  }

  const updatePerformanceFeeBreakdown = (items: PerformanceFeeBreakdown[]) => {
    setData(prev => ({ ...prev, performanceFeeBreakdown: items }))
  }

  const addPerformanceFeeItem = (item: Omit<PerformanceFeeBreakdown, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() }
    setData(prev => ({ ...prev, performanceFeeBreakdown: [...prev.performanceFeeBreakdown, newItem] }))
  }

  const deletePerformanceFeeItem = (id: string) => {
    setData(prev => ({ ...prev, performanceFeeBreakdown: prev.performanceFeeBreakdown.filter(i => i.id !== id) }))
  }

  const updatePerformanceFeeItem = (id: string, item: Omit<PerformanceFeeBreakdown, 'id'>) => {
    setData(prev => ({
      ...prev,
      performanceFeeBreakdown: prev.performanceFeeBreakdown.map(i => i.id === id ? { ...item, id } : i)
    }))
  }

  const updateGuaranteeSettings = (amount: number, label: string) => {
    setData(prev => ({
      ...prev,
      guaranteePerPerson: amount,
      guaranteeLabel: label
    }))
  }

  const updatePersistedUserPassword = (password: string) => {
    setData(prev => ({ ...prev, userPassword: password }))
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('choreo-user-password')
    }
  }

  const updatePersistedAdminPassword = (password: string) => {
    setData(prev => ({ ...prev, adminPassword: password }))
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('choreo-admin-password')
    }
  }

  // Media
  const addMedia = (media: Omit<MediaItem, 'id'>) => {
    const newMedia = { ...media, id: Date.now().toString() }
    setData(prev => ({ ...prev, media: [...prev.media, newMedia] }))
  }

  const deleteMedia = (id: string) => {
    setData(prev => ({ ...prev, media: prev.media.filter(m => m.id !== id) }))
  }

  return (
    <DataContext.Provider value={{
      data,
      updateOwnerMessage,
      addNews,
      deleteNews,
      addFaq,
      deleteFaq,
      updateFaq,
      updateStageInfo,
      updateStageDiagramUrl,
      updateLightingInfo,
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
      updateVenueSeatChartUrl,
      updateVenueImageCrop,
      updateTicketInfo,
      updateSubmissionDetails,
      updatePaymentExplanation,
      updateGoogleDriveUrl,
      updatePerformanceFeeBreakdown,
      addPerformanceFeeItem,
      deletePerformanceFeeItem,
      updatePerformanceFeeItem,
      updateGuaranteeSettings,
      updatePersistedUserPassword,
      updatePersistedAdminPassword,
      addMedia,
      deleteMedia
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
