"use client"

import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/mock/trades"
import { ExtremeTrades } from "@/lib/analytics/risk"
import { cn } from "@/lib/utils"

interface ExtremeTradesCardProps {
  data: ExtremeTrades
}

export function ExtremeTradesCard({ data }: ExtremeTradesCardProps) {
  const { largestGain, largestLoss } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Largest Gain Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            Largest Gain
          </CardTitle>
        </CardHeader>
        <CardContent>
          {largestGain ? (
            <div className="space-y-2">
              <div className={cn(
                "text-2xl font-bold font-mono",
                "text-success"
              )}>
                +{formatCurrency(largestGain.pnl)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono font-medium text-foreground">
                  {largestGain.trade.symbol}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {largestGain.trade.timestamp.toLocaleDateString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Entry: {formatCurrency(largestGain.trade.entryPrice)} → Exit: {formatCurrency(largestGain.trade.exitPrice)}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No winning trades</div>
          )}
        </CardContent>
      </Card>

      {/* Largest Loss Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            Largest Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          {largestLoss ? (
            <div className="space-y-2">
              <div className={cn(
                "text-2xl font-bold font-mono",
                "text-destructive"
              )}>
                {formatCurrency(largestLoss.pnl)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono font-medium text-foreground">
                  {largestLoss.trade.symbol}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {largestLoss.trade.timestamp.toLocaleDateString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Entry: {formatCurrency(largestLoss.trade.entryPrice)} → Exit: {formatCurrency(largestLoss.trade.exitPrice)}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No losing trades</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
