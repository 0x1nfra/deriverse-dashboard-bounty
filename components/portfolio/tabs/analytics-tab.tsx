"use client"

import { useState, useMemo, useEffect } from "react"
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AnalyticsMetricCard } from "@/components/analytics/analytics-metric-card"
import { ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import { WinLossAnalysis } from "@/components/analytics/win-loss-analysis"
import { DirectionalBias } from "@/components/analytics/directional-bias"
import { DurationAnalysis } from "@/components/analytics/duration-analysis"
import { OrderTypeAnalysis } from "@/components/analytics/order-type-analysis"
import { PerformanceByDay } from "@/components/analytics/performance-by-day"
import { PerformanceByHour } from "@/components/analytics/performance-by-hour"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { getFeeMetrics, getDailyVolumeData, formatCurrency } from "@/lib/mock/trades"

const volumePeriods = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "all", label: "ALL", days: 90 },
]

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
  const [selectedVolumePeriod, setSelectedVolumePeriod] = useState("7d")
  const { filteredTrades } = useFilteredTrades(false)
  const volumeDays = volumePeriods.find(p => p.id === selectedVolumePeriod)?.days || 7

  useEffect(() => {
    setIsClient(true)
  }, [])

  const analyticsMetrics = useMemo(() => calculateMetrics(filteredTrades), [filteredTrades])
  const feeMetrics = useMemo(() => getFeeMetrics(filteredTrades), [filteredTrades])
  const dailyVolumeData = useMemo(() => getDailyVolumeData(filteredTrades, volumeDays), [filteredTrades, volumeDays])

  const feeBreakdownData = useMemo(() => [
    { name: "Maker", value: feeMetrics.makerFees, color: "#5471f6" },
    { name: "Taker", value: feeMetrics.takerFees, color: "#06B6D4" },
    { name: "Funding", value: feeMetrics.fundingFees, color: "#8B5CF6" },
  ], [feeMetrics])

  const feeChartConfig = {
    maker: { label: "Maker", color: "#5471f6" },
    taker: { label: "Taker", color: "#06B6D4" },
    funding: { label: "Funding", color: "#8B5CF6" },
  }

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards */}
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

      {/* 2. Win/Loss Analysis | Directional Bias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WinLossAnalysis trades={filteredTrades} />
        <DirectionalBias trades={filteredTrades} />
      </div>

      {/* 4. Order Type Analysis */}
      <OrderTypeAnalysis trades={filteredTrades} />

      {/* 5. Volume & Fee Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volume Chart */}
        <div className="bg-card border border-border rounded-lg overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Trading Volume</h3>
            <div className="flex items-center gap-1">
              {volumePeriods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedVolumePeriod(period.id)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    selectedVolumePeriod === period.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyVolumeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.2)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#151B2B",
                      border: "1px solid #2D3748",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "#FFFFFF" }}
                    itemStyle={{ color: "#FFFFFF" }}
                    formatter={(value: number) => [formatCurrency(value), "Volume"]}
                  />
                  <Bar
                    dataKey="volume"
                    fill="#0EA5E9"
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: "#0EA5E9", fillOpacity: 0.7 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">Fee Breakdown</h3>
          </div>
          <div className="p-5">
            <ChartContainer config={feeChartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {feeBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => {
                      const percentage = feeMetrics.feeBreakdown[value.toLowerCase() as keyof typeof feeMetrics.feeBreakdown]?.percentage ?? 0
                      return (
                        <span className="text-sm text-foreground">
                          {value} <span className="text-muted-foreground">{percentage}%</span>
                        </span>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Fee Impact */}
            <div className="pt-4 border-t border-border mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fee Impact</span>
                <span className={cn(
                  "text-sm font-medium",
                  feeMetrics.feeImpact > 5 ? "text-destructive" : "text-foreground"
                )}>
                  {feeMetrics.feeImpact.toFixed(2)}% of gross P&L
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Fees as percentage of total gross profit/loss
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Duration Analysis */}
      <DurationAnalysis trades={filteredTrades} />

      {/* 7. Performance by Day | Performance by Hour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceByDay trades={filteredTrades} />
        <PerformanceByHour trades={filteredTrades} />
      </div>
    </div>
  )
}
