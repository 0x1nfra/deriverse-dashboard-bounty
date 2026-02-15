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
import { ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import {
  generatePortfolioData,
  calculateRunningDrawdown,
} from "@/lib/analytics/drawdown"

const timePeriods = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: 365 },
]

interface DrawdownDataPoint {
  date: string
  drawdown: number
}

interface DrawdownTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: DrawdownDataPoint
  }>
  label?: string
}

function DrawdownTooltip({ active, payload, label }: DrawdownTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[160px]">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Drawdown:</span>
          <span className="text-sm font-mono font-semibold text-destructive">
            -{payload[0].value.toFixed(2)}%
          </span>
        </div>
      </div>
    )
  }
  return null
}

const chartConfig = {
  drawdown: {
    label: "Drawdown %",
    color: "var(--destructive)",
  },
}

export function DrawdownChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("90D")

  const allData = useMemo(() => {
    const portfolioData = generatePortfolioData()
    const drawdowns = calculateRunningDrawdown(portfolioData)

    return portfolioData.map((point, i) => ({
      date: point.date,
      drawdown: drawdowns[i],
    }))
  }, [])

  const data = useMemo(() => {
    const period = timePeriods.find((p) => p.label === selectedPeriod)
    if (!period) return allData
    return allData.slice(-period.days)
  }, [allData, selectedPeriod])

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Drawdown Over Time
        </h3>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {timePeriods.map((period) => (
            <button
              key={period.label}
              onClick={() => setSelectedPeriod(period.label)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                selectedPeriod === period.label
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                vertical={false}
                opacity={0.5}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                interval={Math.max(Math.floor(data.length / 8) - 1, 0)}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => `-${value}%`}
                domain={[0, "auto"]}
                reversed
                width={50}
              />

              <Tooltip content={<DrawdownTooltip />} />

              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="var(--destructive)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#drawdownGradient)"
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
