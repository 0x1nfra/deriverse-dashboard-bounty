"use client"

import { useState, useMemo } from "react"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  ChartContainer,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Trade } from "@/lib/mock/trades"

interface PortfolioValueChartProps {
  trades: Trade[]
}

const timePeriods = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: 365 },
]

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "var(--primary)",
  },
  drawdown: {
    label: "Drawdown",
    color: "var(--destructive)",
  },
}

// Format currency for display
function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

interface ChartDataPoint {
  date: string
  value: number
  drawdown: number
  peak: number
  drawdownBase: number | null
}

export function PortfolioValueChart({ trades }: PortfolioValueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7D")
  
  // Generate portfolio data from trades
  const allData = useMemo(() => {
    if (trades.length === 0) return []
    
    // Sort trades by timestamp
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    
    // Group trades by date and calculate cumulative PnL
    const dateMap = new Map<string, { pnl: number; date: Date }>()
    let cumulativePnl = 0
    
    sortedTrades.forEach((trade) => {
      const dateKey = trade.timestamp.toISOString().split('T')[0]
      cumulativePnl += trade.pnl
      
      dateMap.set(dateKey, {
        pnl: cumulativePnl,
        date: trade.timestamp,
      })
    })
    
    // Convert to array and calculate drawdowns
    const data = Array.from(dateMap.entries()).map(([dateStr, { pnl }]) => ({
      date: dateStr,
      value: pnl,
    }))
    
    let peak = data[0]?.value || 0
    return data.map((point) => {
      if (point.value > peak) {
        peak = point.value
      }
      const drawdown = peak > 0 ? ((peak - point.value) / peak) * 100 : 0
      const drawdownBase = point.value < peak ? point.value : null
      return {
        date: point.date,
        value: point.value,
        drawdown: drawdown,
        peak: peak,
        drawdownBase: drawdownBase,
      }
    })
  }, [trades])

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    const period = timePeriods.find(p => p.label === selectedPeriod)
    if (!period || selectedPeriod === "ALL") return allData
    
    return allData.slice(-period.days)
  }, [allData, selectedPeriod])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ value: number; dataKey: string; payload: ChartDataPoint }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const value = data.value
      const drawdown = data.drawdown
      const peak = data.peak
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-base font-semibold text-foreground">
            Portfolio Value: ${value.toLocaleString()}
          </p>
          {drawdown > 0 && (
            <p className="text-sm text-destructive mt-1">
              Drawdown: -{drawdown.toFixed(2)}% from peak (${peak.toLocaleString()})
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Portfolio Value</h3>
        <div className="flex items-center gap-1">
          {timePeriods.map((period) => (
            <button
              key={period.label}
              onClick={() => setSelectedPeriod(period.label)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                selectedPeriod === period.label
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
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0} />
                  <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Drawdown overlay - gradient from peak (transparent) to current value (light red) */}
              <Area
                type="monotone"
                dataKey="peak"
                stroke="transparent"
                fill="url(#drawdownGradient)"
                fillOpacity={1}
                isAnimationActive={false}
              />
              
              {/* Main portfolio value line */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
