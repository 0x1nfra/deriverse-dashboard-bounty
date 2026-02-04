"use client"

import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart"
import { AssetAllocationChart } from "@/components/portfolio/asset-allocation-chart"
import { RecentActivityTable } from "@/components/portfolio/recent-activity-table"

export function OverviewTabContent() {
  return (
    <div className="space-y-6">
      {/* Charts Grid - Side by side like reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioValueChart />
        <AssetAllocationChart />
      </div>

      {/* Recent Activity */}
      <RecentActivityTable />
    </div>
  )
}
