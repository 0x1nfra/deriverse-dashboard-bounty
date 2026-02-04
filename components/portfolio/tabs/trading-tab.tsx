"use client"

import { OpenPositionsTable } from "@/components/dashboard/open-positions-table"
import { RecentTradesTable } from "@/components/dashboard/recent-trades-table"
import { PerformanceChart } from "@/components/dashboard/performance-chart"

export function TradingTabContent() {
  return (
    <div className="space-y-6">
      {/* Trading Header */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-foreground">Trading Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">Monitor your positions and recent activity</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OpenPositionsTable />
        <RecentTradesTable />
      </div>

      {/* Performance Chart */}
      <PerformanceChart />
    </div>
  )
}
