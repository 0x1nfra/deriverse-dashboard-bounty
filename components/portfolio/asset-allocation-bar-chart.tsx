"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface AllocationItem {
  symbol: string
  value: number
  percentage: number
}

interface AssetAllocationBarChartProps {
  data: AllocationItem[]
}

// Color palette for allocation items — cool-toned for visual harmony
const colorPalette = [
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#14B8A6", // Teal
  "#64748B", // Slate
  "#A78BFA", // Light violet
  "#38BDF8", // Sky
]

export function AssetAllocationBarChart({ data }: AssetAllocationBarChartProps) {
  // Sort by percentage descending and take top 8
  const chartData = useMemo(() => {
    return data
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8)
      .map((item, index) => ({
        symbol: item.symbol,
        percentage: item.percentage,
        value: item.value,
        color: colorPalette[index % colorPalette.length],
      }))
  }, [data])

  if (chartData.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden p-5">
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          No allocation data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Asset Allocation</h3>
      </div>
      <div className="p-5">
        <ChartContainer config={{}} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => `${value.toFixed(0)}%`}
              />
              <YAxis
                type="category"
                dataKey="symbol"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
                width={50}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legend/Labels */}
        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => (
            <div key={item.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-foreground">{item.symbol}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.percentage.toFixed(1)}% (${(item.value / 1000).toFixed(1)}K)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
