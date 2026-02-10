"use client"

import { useState, useMemo } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Line,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Trade } from "@/lib/mock/trades"

interface EquityCurveChartProps {
  trades: Trade[]
}

const timePeriods = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: null },
]

const chartConfig = {
  equity: {
    label: "Equity",
    color: "#5471f6",
  },
  benchmark: {
    label: "Benchmark",
    color: "#3B82F6",
  },
}

const STARTING_CAPITAL = 40000

export function EquityCurveChart({ trades }: EquityCurveChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("ALL")

  // Build cumulative equity curve from trades grouped by date
  const allData = useMemo(() => {
    if (trades.length === 0) return []

    const sorted = [...trades].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    )

    // Group PnL by date
    const dateMap = new Map<string, number>()
    let cumulativePnl = 0

    for (const trade of sorted) {
      const dateKey = trade.timestamp.toISOString().split("T")[0]
      cumulativePnl += trade.pnl
      dateMap.set(dateKey, cumulativePnl)
    }

    const entries = Array.from(dateMap.entries())
    if (entries.length === 0) return []

    // Build benchmark: linear growth from start to end equity
    const finalEquity = STARTING_CAPITAL + cumulativePnl
    const benchmarkStep =
      entries.length > 1
        ? (finalEquity - STARTING_CAPITAL) / (entries.length - 1)
        : 0

    return entries.map(([dateStr, pnl], i) => ({
      date: dateStr,
      dateFormatted: new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      equity: STARTING_CAPITAL + pnl,
      benchmark: STARTING_CAPITAL + benchmarkStep * i,
    }))
  }, [trades])

  // Filter by selected period
  const chartData = useMemo(() => {
    const period = timePeriods.find((p) => p.label === selectedPeriod)
    if (!period || !period.days) return allData
    return allData.slice(-period.days)
  }, [allData, selectedPeriod])

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Equity Curve</h3>
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
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                vertical={false}
                opacity={0.5}
              />
              <XAxis
                dataKey="dateFormatted"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) =>
                  value >= 1000
                    ? `$${(value / 1000).toFixed(0)}K`
                    : `$${value}`
                }
                width={50}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [
                  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  "",
                ]}
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#0EA5E9"
                strokeWidth={2}
                fillOpacity={0.08}
                fill="#0EA5E9"
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#3B82F6"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
