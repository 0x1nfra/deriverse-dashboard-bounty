"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { MetricCard } from "@/components/metric-card"
import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart"
import { AssetAllocationChart } from "@/components/portfolio/asset-allocation-chart"
import { RecentActivityTable } from "@/components/portfolio/recent-activity-table"
import { cn } from "@/lib/utils"

const tabs = ["Overview", "Allocation", "Risk", "History"]

// Mock portfolio metrics
const portfolioMetrics = {
  totalValue: "$45,230.89",
  totalValueChange: { value: "+$2,100.50", isPositive: true },
  totalPnL: "$5,230.89",
  totalPnLChange: { value: "+12.3%", isPositive: true },
  winRate: "62.5%",
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("Overview")

  return (
    <PageContainer>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors relative",
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard
          label="Total Value"
          value={portfolioMetrics.totalValue}
          change={portfolioMetrics.totalValueChange}
        />
        <MetricCard
          label="Total P&L"
          value={portfolioMetrics.totalPnL}
          change={portfolioMetrics.totalPnLChange}
        />
        <MetricCard
          label="Win Rate"
          value={portfolioMetrics.winRate}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PortfolioValueChart />
        <AssetAllocationChart />
      </div>

      {/* Recent Activity */}
      <RecentActivityTable />
    </PageContainer>
  )
}
