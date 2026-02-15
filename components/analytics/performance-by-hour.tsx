"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Cell } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { formatCurrency, type Trade } from "@/lib/mock/trades"
import { calculateHourOfDayPerformance } from "@/lib/analytics/time-based"
interface PerformanceByHourProps {
  trades: Trade[]
}

export function PerformanceByHour({ trades }: PerformanceByHourProps) {
  const data = useMemo(() => calculateHourOfDayPerformance(trades), [trades])

  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
        No trades available for hourly analysis
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Performance by Hour</h3>
      </div>
      <div className="p-5 space-y-4">
        {/* PnL Bar Chart */}
        <ChartContainer config={{}} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} opacity={0.5} />
              <XAxis
                dataKey="hourLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                interval={2}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "pnl" ? "PnL" : name,
                ]}
              />
              <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? "var(--success)" : "var(--destructive)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Best/Worst Hours */}
        {(() => {
          const activeHours = data.filter((h) => h.trades > 0)
          if (activeHours.length === 0) return null
          const sorted = [...activeHours].sort((a, b) => b.pnl - a.pnl)
          const best = sorted[0]
          const worst = sorted[sorted.length - 1]
          return (
            <div className="space-y-1.5">
              {best && (
                <div className="flex items-center justify-between text-sm px-2 py-1.5 rounded-md hover:bg-muted/50">
                  <span className="text-muted-foreground w-20">Best Hour</span>
                  <span className="text-foreground font-medium w-14">{best.hourLabel}</span>
                  <span className="text-muted-foreground">{best.trades} trades</span>
                  <span className="text-muted-foreground font-mono">{best.winRate.toFixed(0)}% WR</span>
                  <span className="font-mono font-medium text-success">
                    +{formatCurrency(best.pnl)}
                  </span>
                </div>
              )}
              {worst && worst.pnl < 0 && (
                <div className="flex items-center justify-between text-sm px-2 py-1.5 rounded-md hover:bg-muted/50">
                  <span className="text-muted-foreground w-20">Worst Hour</span>
                  <span className="text-foreground font-medium w-14">{worst.hourLabel}</span>
                  <span className="text-muted-foreground">{worst.trades} trades</span>
                  <span className="text-muted-foreground font-mono">{worst.winRate.toFixed(0)}% WR</span>
                  <span className="font-mono font-medium text-destructive">
                    {formatCurrency(worst.pnl)}
                  </span>
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
