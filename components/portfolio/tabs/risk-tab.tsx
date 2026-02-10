"use client"

import { useMemo, useState, useEffect } from "react"
import { ExtremeTradesCard } from "@/components/risk/extreme-trades-card"
import { WinLossAnalysis } from "@/components/risk/win-loss-analysis"
import { DirectionalBiasComponent } from "@/components/risk/directional-bias"
import { DurationAnalysis } from "@/components/risk/duration-analysis"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { useFilters } from "@/hooks/use-filters"
import { NoTradesState, NoFilterResultsState } from "@/components/empty-states"
import {
  calculateExtremeTrades,
  calculateWinLossStats,
  calculateDirectionalBias,
  calculateDurationStats,
} from "@/lib/analytics/risk"

export function RiskTabContent() {
  const { filteredTrades, dateRangeLabel, isLoading } = useFilteredTrades()
  const { resetFilters, isDefault } = useFilters()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate metrics - must be called before any early returns to maintain hook order
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

  // Handle empty states - after all hooks are called
  if (!isLoading && isClient && filteredTrades.length === 0) {
    if (isDefault) {
      return (
        <div className="space-y-6">
          <NoTradesState />
        </div>
      )
    }
    return (
      <div className="space-y-6">
        <NoFilterResultsState onClearFilters={resetFilters} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
