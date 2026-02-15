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
  ReferenceLine,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Trade } from "@/lib/mock/trades"
import {
  calculateRollingSharpe,
  RollingSharpePoint,
} from "@/lib/analytics/risk"

const timePeriods = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: Infinity },
]

interface RollingSharpeTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: RollingSharpePoint
  }>
  label?: string
}

function RollingSharpeTooltip({
  active,
  payload,
  label,
}: RollingSharpeTooltipProps) {
  if (active && payload && payload.length) {
    const value = payload[0].value
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[160px]">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Sharpe:</span>
          <span
            className={cn(
              "text-sm font-mono font-semibold",
              value >= 0 ? "text-success" : "text-destructive"
            )}
          >
            {value.toFixed(2)}
          </span>
        </div>
      </div>
    )
  }
  return null
}

const chartConfig = {
  sharpe: {
    label: "Sharpe Ratio",
    color: "var(--primary)",
  },
}

interface RollingSharpeChartProps {
  trades: Trade[]
}

export function RollingSharpeChart({ trades }: RollingSharpeChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("ALL")

  const allData = useMemo(
    () => calculateRollingSharpe(trades),
    [trades]
  )

  const data = useMemo(() => {
    if (selectedPeriod === "ALL") return allData
    const period = timePeriods.find((p) => p.label === selectedPeriod)
    if (!period) return allData
    return allData.slice(-period.days)
  }, [allData, selectedPeriod])

  if (allData.length === 0) return null

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Rolling Sharpe Ratio (30-Trade Window)
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
                <linearGradient
                  id="sharpeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0.02}
                  />
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
                tickFormatter={(value) => value.toFixed(1)}
                width={40}
              />

              <ReferenceLine
                y={0}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />

              <Tooltip content={<RollingSharpeTooltip />} />

              <Area
                type="monotone"
                dataKey="sharpe"
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#sharpeGradient)"
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
