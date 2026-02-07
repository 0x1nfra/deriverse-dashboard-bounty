"use client"

import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { getVolumeMetrics, getFeeMetrics, getDailyVolumeData, formatCurrency, formatPercentage } from "@/lib/mock/trades"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { useFilters } from "@/hooks/use-filters"
import { NoTradesState, NoFilterResultsState } from "@/components/empty-states"
import { OrderTypeAnalysis } from "@/components/analytics/order-type-analysis"

const timePeriods = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "all", label: "ALL", days: 90 },
]

export function VolumeFeesTabContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [isClient, setIsClient] = useState(false)
  const days = timePeriods.find(p => p.id === selectedPeriod)?.days || 7

  // Use filtered trades from global filters
  const { filteredTrades, dateRangeLabel, isLoading } = useFilteredTrades()
  const { resetFilters, isDefault } = useFilters()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle empty states
  if (!isLoading && isClient && filteredTrades.length === 0) {
    if (isDefault) {
      return (
        <div className="space-y-6">
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-foreground">Volume & Fees Analysis</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Track your trading volume and fee impact
            </p>
          </div>
          <NoTradesState />
        </div>
      )
    }
    return (
      <div className="space-y-6">
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-foreground">Volume & Fees Analysis</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Track your trading volume and fee impact
          </p>
        </div>
        <NoFilterResultsState onClearFilters={resetFilters} />
      </div>
    )
  }

  // Calculate metrics based on filtered trades
  const volumeMetrics = useMemo(() => getVolumeMetrics(filteredTrades), [filteredTrades])
  const feeMetrics = useMemo(() => getFeeMetrics(filteredTrades), [filteredTrades])
  const dailyVolumeData = useMemo(() => getDailyVolumeData(filteredTrades, days), [filteredTrades, days])

  // Fee breakdown data for donut chart - updated colors
  const feeBreakdownData = [
    { name: "Maker", value: feeMetrics.makerFees, color: "#5471f6" },   // Blue
    { name: "Taker", value: feeMetrics.takerFees, color: "#06B6D4" },   // Cyan
    { name: "Funding", value: feeMetrics.fundingFees, color: "#8B5CF6" }, // Purple
  ]

  const chartConfig = {
    maker: { label: "Maker", color: "#5471f6" },
    taker: { label: "Taker", color: "#06B6D4" },
    funding: { label: "Funding", color: "#8B5CF6" },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-foreground">Volume & Fees Analysis</h2>
        <p className="text-muted-foreground text-sm mt-1" suppressHydrationWarning>
          Track your trading volume and fee impact • {dateRangeLabel} • {isClient ? filteredTrades.length : '-'} trades
        </p>
      </div>

      {/* Volume Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <VolumeCard
          label="24h Volume"
          value={formatCurrency(volumeMetrics.period24h)}
          change={volumeMetrics.change24h}
          changeLabel="vs previous 24h"
        />
        <VolumeCard
          label="7d Volume"
          value={formatCurrency(volumeMetrics.period7d)}
          change={volumeMetrics.change7d}
          changeLabel="vs previous 7d"
        />
        <VolumeCard
          label="30d Volume"
          value={formatCurrency(volumeMetrics.period30d)}
          change={volumeMetrics.change30d}
          changeLabel="vs previous 30d"
        />
        <VolumeCard
          label="Total Volume"
          value={formatCurrency(volumeMetrics.periodAll)}
          change={0}
          changeLabel="All time"
          showChange={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volume Chart */}
        <div className="bg-card border border-border rounded-lg overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Trading Volume</h3>
            <div className="flex items-center gap-1">
              {timePeriods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    selectedPeriod === period.id
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
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5471f6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
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
                    fill="url(#volumeGradient)" 
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: "#5471f6", fillOpacity: 0.8 }}
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
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
                    formatter={(value, entry) => {
                      const item = feeBreakdownData.find((d) => d.name === value)
                      const percentage = item ? feeMetrics.feeBreakdown[value.toLowerCase() as keyof typeof feeMetrics.feeBreakdown].percentage : 0
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

      {/* Order Type Performance Analysis */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Order Type Performance
        </h3>
        <OrderTypeAnalysis trades={filteredTrades} />
      </div>
    </div>
  )
}

// Volume Card Component
interface VolumeCardProps {
  label: string
  value: string
  change: number
  changeLabel: string
  showChange?: boolean
}

function VolumeCard({ label, value, change, changeLabel, showChange = true }: VolumeCardProps) {
  const isPositive = change >= 0

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        {showChange && (
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <ArrowUpIcon className="h-3 w-3 text-success" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-destructive" />
            )}
            <span className={cn(
              "text-xs",
              isPositive ? "text-success" : "text-destructive"
            )}>
              {formatPercentage(change)}
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
