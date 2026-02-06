"use client"

import { useState, useEffect } from "react"
import { OpenPositionsTable } from "@/components/dashboard/open-positions-table"
import { RecentTradesTable } from "@/components/dashboard/recent-trades-table"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"

export function TradingTabContent() {
  const { filteredTrades, dateRangeLabel } = useFilteredTrades()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="space-y-6">
      {/* Trading Header */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-foreground">Trading Overview</h2>
        <p className="text-muted-foreground text-sm mt-1" suppressHydrationWarning>
          Monitor your positions and recent activity • {dateRangeLabel} • {isClient ? filteredTrades.length : '-'} trades
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OpenPositionsTable trades={filteredTrades} />
        <RecentTradesTable trades={filteredTrades} />
      </div>

      {/* Performance Chart */}
      <PerformanceChart trades={filteredTrades} />
    </div>
  )
}
