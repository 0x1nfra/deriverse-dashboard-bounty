"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/mock/trades"
import { DirectionalBias } from "@/lib/analytics/risk"
import { cn } from "@/lib/utils"

interface DirectionalBiasProps {
  data: DirectionalBias
}

export function DirectionalBiasComponent({ data }: DirectionalBiasProps) {
  const { longCount, shortCount, longPercentage, shortPercentage, longPnL, shortPnL } = data

  const chartData = [
    { name: "Long", value: longCount, color: "#10B981" },
    { name: "Short", value: shortCount, color: "#EF4444" },
  ]

  const chartConfig = {
    long: { label: "Long", color: "#10B981" },
    short: { label: "Short", color: "#EF4444" },
  }

  const totalTrades = longCount + shortCount
  const netBias = longPercentage - shortPercentage

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Directional Bias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-[200px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
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
                    formatter={(value) => {
                      const item = chartData.find((d) => d.name === value)
                      return (
                        <span className="text-sm text-foreground">
                          {value} <span className="text-muted-foreground">{item?.value}</span>
                        </span>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            {/* Bias Indicator */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Overall Bias</div>
              <div className={cn(
                "text-lg font-semibold",
                Math.abs(netBias) < 10 ? "text-yellow-500" : netBias > 0 ? "text-success" : "text-destructive"
              )}>
                {Math.abs(netBias) < 10 ? "Neutral" : netBias > 0 ? "Long Bias" : "Short Bias"}
                <span className="text-sm text-muted-foreground ml-2">({netBias > 0 ? '+' : ''}{netBias.toFixed(0)}%)</span>
              </div>
            </div>

            {/* Long Stats */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-success">Long Trades</span>
                <span className="text-sm font-mono">{longCount} ({longPercentage.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>PnL</span>
                <span className={cn(
                  "font-mono",
                  longPnL >= 0 ? "text-success" : "text-destructive"
                )}>
                  {longPnL >= 0 ? '+' : ''}{formatCurrency(longPnL)}
                </span>
              </div>
            </div>

            {/* Short Stats */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-destructive">Short Trades</span>
                <span className="text-sm font-mono">{shortCount} ({shortPercentage.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>PnL</span>
                <span className={cn(
                  "font-mono",
                  shortPnL >= 0 ? "text-success" : "text-destructive"
                )}>
                  {shortPnL >= 0 ? '+' : ''}{formatCurrency(shortPnL)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Trades</span>
                <span className="font-mono font-medium">{totalTrades}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
