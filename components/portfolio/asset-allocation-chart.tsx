"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface AllocationItem {
  symbol: string
  value: number
  percentage: number
}

interface AssetAllocationChartProps {
  data: AllocationItem[]
}

const defaultChartConfig = {
  sol: { label: "SOL", color: "#5471f6" },
  btc: { label: "BTC", color: "#38bdf8" },
  eth: { label: "ETH", color: "#06b6d4" },
  usdc: { label: "USDC", color: "#94a3b8" },
}

// Color palette for allocation items — matches chart variable palette
const colorPalette = [
  "#5471f6", // Primary blue
  "#38bdf8", // Sky blue
  "#06b6d4", // Cyan
  "#818cf8", // Indigo
  "#a78bfa", // Lavender
  "#f472b6", // Pink
  "#94a3b8", // Cool gray
  "#5eead4", // Teal (overflow)
]

export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  // Transform allocation data for the pie chart
  const chartData = data.map((item, index) => ({
    name: item.symbol,
    value: item.percentage,
    color: colorPalette[index % colorPalette.length],
  }))

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Asset Allocation</h3>
      </div>
      <div className="p-5">
        <ChartContainer config={defaultChartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
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
                  const item = chartData.find((d) => d.name === value)
                  return (
                    <span className="text-sm text-foreground">
                      {value} <span className="text-muted-foreground">{item?.value.toFixed(1)}%</span>
                    </span>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
