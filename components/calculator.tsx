"use client"

import { useState, useMemo } from 'react'
import { Users, Wallet, TrendingUp, Minus, Plus, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useData } from '@/lib/data-context'
import { LinkifyBlock } from '@/components/linkify-text'

export function Calculator() {
  const [performers, setPerformers] = useState(5)
  const { data } = useData()

  const calculations = useMemo(() => {
    // 出演料の各内訳を計算
    const breakdownItems = data.performanceFeeBreakdown.map(item => ({
      ...item,
      total: performers * item.amountPerPerson
    }))
    
    // 出演料合計
    const performanceFeeTotal = breakdownItems.reduce((sum, item) => sum + item.total, 0)
    
    // ギャランティー合計
    const guaranteeTotal = performers * data.guaranteePerPerson
    
    // 振込合計金額 = 出演料合計 - ギャランティー合計
    const transferTotal = performanceFeeTotal - guaranteeTotal
    
    return {
      breakdownItems,
      performanceFeeTotal,
      guaranteeTotal,
      transferTotal,
    }
  }, [performers, data.performanceFeeBreakdown, data.guaranteePerPerson])

  const handlePerformersChange = (value: number) => {
    if (value >= 1 && value <= 50) {
      setPerformers(value)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-2">
            出演料・ギャランティ
          </h1>
          <p className="text-muted-foreground">
            出演人数を入力して、報酬を計算します
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <Users className="w-5 h-5" />
              出演人数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePerformersChange(performers - 1)}
                disabled={performers <= 1}
                className="w-12 h-12"
              >
                <Minus className="w-5 h-5" />
              </Button>

              <div className="relative w-24">
                <Input
                  type="number"
                  value={performers}
                  onChange={(e) => handlePerformersChange(parseInt(e.target.value) || 1)}
                  className="h-16 text-center text-3xl font-bold bg-muted border-border text-foreground"
                  min={1}
                  max={50}
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePerformersChange(performers + 1)}
                disabled={performers >= 50}
                className="w-12 h-12"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              1名 〜 50名まで
            </p>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Guarantee - Large & Emphasized (First) */}
          <Card className="bg-foreground border-foreground">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-background/70" />
                  <span className="text-background/70 text-sm tracking-wide uppercase">
                    {data.guaranteeLabel}
                  </span>
                </div>
                <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-background tracking-tighter">
                  {formatCurrency(calculations.guaranteeTotal)}
                </div>
                <p className="mt-4 text-background/50 text-sm">
                  {performers}名 x {formatCurrency(data.guaranteePerPerson)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Transfer Total (振込合計金額) */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-foreground font-medium">振込合計金額</span>
                    <p className="text-xs text-muted-foreground">出演料合計 - ギャランティー</p>
                  </div>
                </div>
                <span className="text-2xl font-mono text-foreground font-bold">
                  {formatCurrency(calculations.transferTotal)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Performance Fee Breakdown - 出演料の内訳 */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-foreground text-base">
                <Receipt className="w-4 h-4" />
                出演料の内訳
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {calculations.breakdownItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <span className="text-foreground">{item.label}</span>
                    <p className="text-xs text-muted-foreground">
                      {performers}名 x {formatCurrency(item.amountPerPerson)}
                    </p>
                  </div>
                  <span className="font-mono text-foreground">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
              
              {/* Performance Fee Total */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-foreground/20">
                <span className="text-foreground font-semibold">出演料合計</span>
                <span className="text-lg font-mono text-foreground font-bold">
                  {formatCurrency(calculations.performanceFeeTotal)}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-muted-foreground text-center">
          ※ 実際の金額は諸条件により異なる場合があります。詳細は運営までお問い合わせください。
        </p>

        {/* Payment Explanation */}
        <Card className="bg-card border-border mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <Wallet className="w-5 h-5" />
              振込について
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LinkifyBlock 
              text={data.paymentExplanation} 
              className="text-foreground/80 leading-relaxed text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
