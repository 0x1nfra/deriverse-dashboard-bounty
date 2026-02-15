"use client"

import { useMemo } from "react"
import { formatCurrency, type Trade } from "@/lib/mock/trades"
import { calculateDirectionalBias } from "@/lib/analytics/risk"
import { cn } from "@/lib/utils"

interface DirectionalBiasProps {
  trades: Trade[]
}

export function DirectionalBias({ trades }: DirectionalBiasProps) {
  const bias = useMemo(() => calculateDirectionalBias(trades), [trades])

  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
        No trades available for directional analysis
      </div>
    )
  }

  const total = bias.longCount + bias.shortCount

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Directional Bias</h3>
      </div>
      <div className="p-5 space-y-5">
        {/* Stacked Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-success">Long {bias.longPercentage.toFixed(1)}%</span>
            <span className="text-destructive">Short {bias.shortPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-muted">
            {bias.longPercentage > 0 && (
              <div
                className="bg-success transition-all"
                style={{ width: `${bias.longPercentage}%` }}
              />
            )}
            {bias.shortPercentage > 0 && (
              <div
                className="bg-destructive transition-all"
                style={{ width: `${bias.shortPercentage}%` }}
              />
            )}
          </div>
        </div>

        {/* Direction Details */}
        <div className="grid grid-cols-2 gap-4">
          <DirectionCard
            label="Long"
            count={bias.longCount}
            total={total}
            pnl={bias.longPnL}
            colorClass="text-success"
          />
          <DirectionCard
            label="Short"
            count={bias.shortCount}
            total={total}
            pnl={bias.shortPnL}
            colorClass="text-destructive"
          />
        </div>
      </div>
    </div>
  )
}

function DirectionCard({
  label,
  count,
  total,
  pnl,
  colorClass,
}: {
  label: string
  count: number
  total: number
  pnl: number
  colorClass: string
}) {
  return (
    <div className="rounded-md border border-border p-3 space-y-2">
      <div className={cn("text-sm font-medium", colorClass)}>{label}</div>
      <div className="text-xs text-muted-foreground">
        {count} of {total} trades
      </div>
      <div
        className={cn(
          "text-lg font-bold font-mono",
          pnl >= 0 ? "text-success" : "text-destructive"
        )}
      >
        {pnl >= 0 ? "+" : ""}
        {formatCurrency(pnl)}
      </div>
    </div>
  )
}
