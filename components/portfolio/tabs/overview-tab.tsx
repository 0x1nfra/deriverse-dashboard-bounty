"use client"

import { useMemo } from "react"
import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart"
import { AssetAllocationChart } from "@/components/portfolio/asset-allocation-chart"
import { RecentActivityTable } from "@/components/portfolio/recent-activity-table"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"

export function OverviewTabContent() {
  const { filteredTrades, dateRangeLabel } = useFilteredTrades()

  // Calculate allocation data from filtered trades
  const allocationData = useMemo(() => {
    const symbolTotals = filteredTrades.reduce((acc, trade) => {
      const notional = trade.size * trade.entryPrice
      acc[trade.symbol] = (acc[trade.symbol] || 0) + notional
      return acc
    }, {} as Record<string, number>)

    const total = Object.values(symbolTotals).reduce((sum, val) => sum + val, 0)
    
    return Object.entries(symbolTotals)
      .map(([symbol, value]) => ({
        symbol,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value)
  }, [filteredTrades])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {dateRangeLabel} • {filteredTrades.length.toLocaleString()} trades
        </p>
      </div>

      {/* Charts Grid - Side by side like reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioValueChart trades={filteredTrades} />
        <AssetAllocationChart data={allocationData} />
      </div>

      {/* Recent Activity */}
      <RecentActivityTable trades={filteredTrades} />
    </div>
  )
}
