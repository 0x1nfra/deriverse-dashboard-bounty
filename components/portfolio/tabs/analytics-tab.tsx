"use client"

import { useState, useMemo, useEffect } from "react"
import { AnalyticsMetricCard } from "@/components/analytics/analytics-metric-card"
import { EquityCurveChart } from "@/components/analytics/equity-curve-chart"
import { StrategyPerformanceTable } from "@/components/analytics/strategy-performance-table"
import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart"
import { AssetAllocationBarChart } from "@/components/portfolio/asset-allocation-bar-chart"
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
  
  const winRate = (winningTrades.length / trades.length) * 100
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0
  
  let maxDrawdown = 0
  let peak = 0
  let runningPnl = 0
  
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
  
  const startingCapital = 40000
  const totalReturn = (totalPnl / startingCapital) * 100
  
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
  const [isClient, setIsClient] = useState(false)
  const { filteredTrades, dateRangeLabel } = useFilteredTrades()

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const analyticsMetrics = useMemo(() => calculateMetrics(filteredTrades), [filteredTrades])

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

      {/* Portfolio Value Chart */}
      <PortfolioValueChart trades={filteredTrades} />

      {/* Asset Allocation - Horizontal Bar Chart */}
      <AssetAllocationBarChart data={allocationData} />

      {/* Equity Curve Chart */}
      <EquityCurveChart />

      {/* Strategy Performance Table */}
      <StrategyPerformanceTable />
    </div>
  )
}
