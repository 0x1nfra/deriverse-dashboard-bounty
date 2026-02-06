"use client"

import { useState, useMemo } from "react"
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
import { useFilteredTrades } from "@/hooks/use-filtered-trades"

function calculateMetrics(trades: ReturnType<typeof useFilteredTrades>['filteredTrades']) {
  if (trades.length === 0) {
    return {
      return: { value: "0.0%", subtitle: "No trades", isPositive: true },
      winRate: { value: "0.0%", subtitle: null, percentage: 0 },
      profitFactor: { value: "0.0", effectLabel: "N/A", isPositive: false },
      maxDrawdown: { value: "0.0%", sharpe: "0.00", isPositive: false },
    }
  }

  const winningTrades = trades.filter(t => t.pnl > 0)
  const losingTrades = trades.filter(t => t.pnl < 0)
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0)
  const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0)
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0))
  
  // Calculate win rate
  const winRate = (winningTrades.length / trades.length) * 100
  
  // Calculate profit factor
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0
  
  // Calculate max drawdown (simplified)
  let maxDrawdown = 0
  let peak = 0
  let runningPnl = 0
  
  // Sort trades by timestamp
  const sortedTrades = [...trades].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  
  for (const trade of sortedTrades) {
    runningPnl += trade.pnl
    if (runningPnl > peak) {
      peak = runningPnl
    }
    const drawdown = peak - runningPnl
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }
  
  // Calculate total return percentage (assuming $40k starting capital)
  const startingCapital = 40000
  const totalReturn = (totalPnl / startingCapital) * 100
  
  // Calculate Sharpe ratio (simplified)
  const returns = trades.map(t => t.pnlPercentage)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(365) : 0

  return {
    return: { 
      value: `${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(1)}%`, 
      subtitle: `${trades.length} trades`, 
      isPositive: totalReturn >= 0 
    },
    winRate: { 
      value: `${winRate.toFixed(1)}%`, 
      subtitle: `${winningTrades.length}W / ${losingTrades.length}L`, 
      percentage: Math.round(winRate) 
    },
    profitFactor: { 
      value: profitFactor.toFixed(2), 
      effectLabel: profitFactor >= 2 ? "Strong" : profitFactor >= 1.5 ? "Good" : "Weak", 
      isPositive: profitFactor >= 1.5 
    },
    maxDrawdown: { 
      value: `-${((maxDrawdown / startingCapital) * 100).toFixed(2)}%`, 
      sharpe: sharpeRatio.toFixed(2), 
      isPositive: false 
    },
  }
}

export function AnalyticsTabContent() {
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const { filteredTrades, dateRangeLabel } = useFilteredTrades()
  
  const analyticsMetrics = useMemo(() => calculateMetrics(filteredTrades), [filteredTrades])

  const handleExport = (format: string) => {
    console.log(`Exporting analytics data as ${format}`)
    setExportMenuOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Performance Analytics</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Detailed performance metrics • {dateRangeLabel} • {filteredTrades.length.toLocaleString()} trades
          </p>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <StrategyPerformanceTable />
    </div>
  )
}
