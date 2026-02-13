"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Cell } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { formatCurrency, type Trade } from "@/lib/mock/trades"
import { calculateDayOfWeekPerformance } from "@/lib/analytics/time-based"

interface PerformanceByDayProps {
  trades: Trade[]
}

export function PerformanceByDay({ trades }: PerformanceByDayProps) {
  const data = useMemo(() => calculateDayOfWeekPerformance(trades), [trades])
  const activeDays = useMemo(() => data.filter((d) => d.trades > 0), [data])

  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
        No trades available for day-of-week analysis
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Performance by Day</h3>
      </div>
      <div className="p-5 space-y-4">
        {/* PnL Bar Chart */}
        <ChartContainer config={{}} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.2)" vertical={false} />
              <XAxis
                dataKey="dayShort"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#151B2B",
                  border: "1px solid #2D3748",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "#FFFFFF" }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "pnl" ? "PnL" : name,
                ]}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? "#10B981" : "#EF4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Day Stats Table */}
        <div className="space-y-1.5">
          {activeDays.map((day) => (
            <div
              key={day.day}
              className="flex items-center justify-between text-sm px-2 py-1.5 rounded-md hover:bg-muted/50"
            >
              <span className="text-foreground font-medium w-10">{day.dayShort}</span>
              <span className="text-muted-foreground">{day.trades} trades</span>
              <span className="text-muted-foreground font-mono">
                {day.winRate.toFixed(0)}% WR
              </span>
              <span
                className={`font-mono font-medium ${
                  day.pnl >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {day.pnl >= 0 ? "+" : ""}
                {formatCurrency(day.pnl)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
