"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { AnalyticsMetricCard } from "@/components/analytics/analytics-metric-card"
import { EquityCurveChart } from "@/components/analytics/equity-curve-chart"
import { StrategyPerformanceTable } from "@/components/analytics/strategy-performance-table"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock analytics metrics matching the mockup
const analyticsMetrics = {
  return: { value: "+11.6%", subtitle: "vs Benchmark +8.2%", isPositive: true },
  winRate: { value: "62.5%", subtitle: null, percentage: 22 },
  profitFactor: { value: "1.8", effectLabel: "-EF43%", isPositive: false },
  maxDrawdown: { value: "-12.44%", sharpe: "1.45", isPositive: false },
}

export default function AnalyticsPage() {
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const handleExport = (format: string) => {
    console.log(`Exporting analytics data as ${format}`)
    setExportMenuOpen(false)
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Performance Analytics</h1>
        <DropdownMenu open={exportMenuOpen} onOpenChange={setExportMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              Export
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnalyticsMetricCard
          label="Return"
          value={analyticsMetrics.return.value}
          subtitle={analyticsMetrics.return.subtitle}
          isPositive={analyticsMetrics.return.isPositive}
        />
        <AnalyticsMetricCard
          label="Win Rate"
          value={analyticsMetrics.winRate.value}
          percentage={analyticsMetrics.winRate.percentage}
        />
        <AnalyticsMetricCard
          label="Profit Factor"
          value={analyticsMetrics.profitFactor.value}
          effectLabel={analyticsMetrics.profitFactor.effectLabel}
          isPositive={analyticsMetrics.profitFactor.isPositive}
        />
        <AnalyticsMetricCard
          label="Max Drawdown"
          value={analyticsMetrics.maxDrawdown.value}
          sharpe={analyticsMetrics.maxDrawdown.sharpe}
          isPositive={analyticsMetrics.maxDrawdown.isPositive}
        />
      </div>

      {/* Equity Curve Chart */}
      <EquityCurveChart />

      {/* Strategy Performance Table */}
      <div className="mt-8">
        <StrategyPerformanceTable />
      </div>
    </PageContainer>
  )
}
