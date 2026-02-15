"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency, type Trade } from "@/lib/mock/trades"
import { calculateWinLossStats, calculateExtremeTrades } from "@/lib/analytics/risk"
import { cn } from "@/lib/utils"

interface WinLossAnalysisProps {
  trades: Trade[]
}

export function WinLossAnalysis({ trades }: WinLossAnalysisProps) {
  const stats = useMemo(() => calculateWinLossStats(trades), [trades])
  const extremes = useMemo(() => calculateExtremeTrades(trades), [trades])

  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
        No trades available for win/loss analysis
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Win/Loss Analysis</h3>
      </div>
      <div className="p-5 space-y-5">
        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <MetricItem
            label="Avg Win"
            value={`+${formatCurrency(stats.avgWin)}`}
            className="text-success"
          />
          <MetricItem
            label="Avg Loss"
            value={`-${formatCurrency(stats.avgLoss)}`}
            className="text-destructive"
          />
          <MetricItem
            label="Risk/Reward"
            value={
              stats.riskRewardRatio === Infinity
                ? "∞"
                : stats.riskRewardRatio.toFixed(2)
            }
            className={stats.riskRewardRatio >= 1 ? "text-success" : "text-destructive"}
          />
        </div>

        {/* Extreme Trades */}
        <div className="space-y-3">
          {extremes.largestGain && (
            <div className="flex items-center justify-between rounded-md bg-success/5 border border-success/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">Best Trade</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">
                  {extremes.largestGain.trade.symbol}{" "}
                  <span className="text-muted-foreground capitalize">
                    {extremes.largestGain.trade.side}
                  </span>
                </span>
                <span className="font-mono text-sm font-medium text-success">
                  +{formatCurrency(extremes.largestGain.pnl)}
                </span>
              </div>
            </div>
          )}
          {extremes.largestLoss && (
            <div className="flex items-center justify-between rounded-md bg-destructive/5 border border-destructive/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground">Worst Trade</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">
                  {extremes.largestLoss.trade.symbol}{" "}
                  <span className="text-muted-foreground capitalize">
                    {extremes.largestLoss.trade.side}
                  </span>
                </span>
                <span className="font-mono text-sm font-medium text-destructive">
                  {formatCurrency(extremes.largestLoss.pnl)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricItem({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={cn("text-lg font-bold font-mono", className)}>{value}</div>
    </div>
  )
}
