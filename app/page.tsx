import { PageContainer } from "@/components/page-container"
import { MetricCard } from "@/components/metric-card"
import { OpenPositionsTable } from "@/components/dashboard/open-positions-table"
import { RecentTradesTable } from "@/components/dashboard/recent-trades-table"
import { PerformanceChart } from "@/components/dashboard/performance-chart"

// Mock data - will be replaced with API calls
const mockMetrics = {
  portfolioValue: "$45,230.89",
  portfolioChange: { value: "+$2,100.50", percentage: "+4.8%", isPositive: true },
  todayPnL: "$1,234.56",
  todayPnLChange: { value: "+2.8%", isPositive: true },
}

export default function TradingPage() {
  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Trading Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your positions and recent activity</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Portfolio Value"
          value={mockMetrics.portfolioValue}
          change={mockMetrics.portfolioChange}
        />
        <MetricCard
          label="Today's P&L"
          value={mockMetrics.todayPnL}
          change={mockMetrics.todayPnLChange}
        />
        <MetricCard
          label="Open Positions"
          value="4"
        />
        <MetricCard
          label="Win Rate"
          value="62.5%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <OpenPositionsTable />
        <RecentTradesTable />
      </div>

      {/* Performance Chart */}
      <PerformanceChart />
    </PageContainer>
  )
}
