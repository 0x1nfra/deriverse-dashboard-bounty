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
  btc: { label: "BTC", color: "#3B82F6" },
  eth: { label: "ETH", color: "#10B981" },
  usdc: { label: "USDC", color: "#64748B" },
}

// Color palette for allocation items
const colorPalette = [
  "#5471f6",
  "#3B82F6", 
  "#10B981",
  "#64748B",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
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
