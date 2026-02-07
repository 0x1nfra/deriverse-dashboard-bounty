"use client"

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Trade } from "@/lib/mock/trades"

// Mock performance data (fallback when no trades provided)
const defaultPerformanceData = [
  { day: "Day 1", value: 42000 },
  { day: "Day 2", value: 43200 },
  { day: "Day 3", value: 42800 },
  { day: "Day 4", value: 44100 },
  { day: "Day 5", value: 43500 },
  { day: "Day 6", value: 44800 },
  { day: "Day 7", value: 45230 },
]

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "#5471f6",
  },
}

interface PerformanceChartProps {
  trades?: Trade[]
}

function generatePerformanceDataFromTrades(trades: Trade[]): { day: string; value: number }[] {
  // Group trades by day and calculate cumulative portfolio value
  const tradesByDay = new Map<string, number>()
  
  trades.forEach((trade) => {
    const date = trade.timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const dailyPnL = tradesByDay.get(date) || 0
    tradesByDay.set(date, dailyPnL + trade.pnl)
  })

  // Sort by date and take last 7 days
  const sortedEntries = Array.from(tradesByDay.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-7)

  if (sortedEntries.length === 0) {
    return defaultPerformanceData
  }

  // Calculate cumulative values
  let runningValue = 40000
  return sortedEntries.map(([day, pnl]) => {
    runningValue += pnl
    return { day, value: Math.round(runningValue) }
  })
}

export function PerformanceChart({ trades }: PerformanceChartProps) {
  // Use provided trades or fallback to default mock data
  const performanceData = trades && trades.length > 0
    ? generatePerformanceDataFromTrades(trades)
    : defaultPerformanceData

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Portfolio Performance (7 Days)</h3>
        <div className="flex items-center gap-2">
          {["7D", "30D", "90D", "1Y", "ALL"].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                period === "7D"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={performanceData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5471f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5471f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                domain={["dataMin - 1000", "dataMax + 1000"]}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#5471f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
