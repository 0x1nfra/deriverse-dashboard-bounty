"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

// Mock allocation data matching the mockup
const allocationData = [
  { name: "SOL", value: 45, color: "#7C3AED" },
  { name: "BTC", value: 30, color: "#3B82F6" },
  { name: "ETH", value: 15, color: "#10B981" },
  { name: "USDC", value: 10, color: "#64748B" },
]

const chartConfig = {
  sol: { label: "SOL", color: "#7C3AED" },
  btc: { label: "BTC", color: "#3B82F6" },
  eth: { label: "ETH", color: "#10B981" },
  usdc: { label: "USDC", color: "#64748B" },
}

export function AssetAllocationChart() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Asset Allocation</h3>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
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
                  const item = allocationData.find((d) => d.name === value)
                  return (
                    <span className="text-sm text-foreground">
                      {value} <span className="text-muted-foreground">{item?.value}%</span>
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
