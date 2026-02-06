"use client"

import { useMemo } from "react"
import { ExtremeTradesCard } from "@/components/risk/extreme-trades-card"
import { WinLossAnalysis } from "@/components/risk/win-loss-analysis"
import { DirectionalBiasComponent } from "@/components/risk/directional-bias"
import { DurationAnalysis } from "@/components/risk/duration-analysis"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import {
  calculateExtremeTrades,
  calculateWinLossStats,
  calculateDirectionalBias,
  calculateDurationStats,
} from "@/lib/analytics/risk"

export function RiskTabContent() {
  const { filteredTrades, dateRangeLabel } = useFilteredTrades()

  const extremeTrades = useMemo(
    () => calculateExtremeTrades(filteredTrades),
    [filteredTrades]
  )

  const winLossStats = useMemo(
    () => calculateWinLossStats(filteredTrades),
    [filteredTrades]
  )

  const directionalBias = useMemo(
    () => calculateDirectionalBias(filteredTrades),
    [filteredTrades]
  )

  const durationStats = useMemo(
    () => calculateDurationStats(filteredTrades),
    [filteredTrades]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-foreground">Risk Analytics</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Risk management metrics and trade analysis • {dateRangeLabel} • {filteredTrades.length.toLocaleString()} trades
        </p>
      </div>

      {/* Section 1: Extreme Trades */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Extreme Trades
        </h3>
        <ExtremeTradesCard data={extremeTrades} />
      </section>

      {/* Section 2: Win/Loss Analysis */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Win/Loss Analysis
        </h3>
        <WinLossAnalysis data={winLossStats} />
      </section>

      {/* Section 3: Directional Bias */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Directional Bias
        </h3>
        <DirectionalBiasComponent data={directionalBias} />
      </section>

      {/* Section 4: Duration Analysis */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Trade Duration Analysis
        </h3>
        <DurationAnalysis stats={durationStats} trades={filteredTrades} />
      </section>
    </div>
  )
}
