"use client"

import { useState } from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// Mock equity curve data matching the mockup
const equityData = [
  { period: "7D", primary: 10000, secondary: 9500 },
  { period: "30D", primary: 12000, secondary: 11000 },
  { period: "30D-2", primary: 14000, secondary: 13500 },
  { period: "90D", primary: 18000, secondary: 16000 },
  { period: "20D", primary: 22000, secondary: 19000 },
  { period: "20D-2", primary: 20000, secondary: 21000 },
  { period: "ALL", primary: 24000, secondary: 22500 },
]

const timePeriods = ["7D", "30D", "90D", "1Y", "ALL"]

const chartConfig = {
  primary: {
    label: "Portfolio",
    color: "#5471f6",
  },
  secondary: {
    label: "Benchmark",
    color: "#3B82F6",
  },
}

export function EquityCurveChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y")

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Equity Curve</h3>
        <div className="flex items-center gap-1">
          {timePeriods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                selectedPeriod === period
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={equityData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5471f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#5471f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="primary"
                stroke="#5471f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#equityGradient)"
              />
              <Line
                type="monotone"
                dataKey="secondary"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
