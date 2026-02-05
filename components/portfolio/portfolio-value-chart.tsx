"use client"

import { useState } from "react"
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
import { cn } from "@/lib/utils"

// Mock portfolio value data
const portfolioData = [
  { period: "7D", value: 38000 },
  { period: "30D", value: 39500 },
  { period: "60D", value: 41200 },
  { period: "90D", value: 40800 },
  { period: "120D", value: 42500 },
  { period: "150D", value: 44100 },
  { period: "ALL", value: 45230 },
]

const timePeriods = ["7D", "30D", "90D", "1Y", "ALL"]

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "#5471f6",
  },
}

export function PortfolioValueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("7D")

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Portfolio Value</h3>
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
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={portfolioData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5471f6" stopOpacity={0.3} />
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
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#5471f6"
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
