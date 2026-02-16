"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { type Trade } from "@/lib/mock/trades"
import {
  calculateDurationStats,
  getDurationDistribution,
  formatDuration,
} from "@/lib/analytics/risk"

interface DurationAnalysisProps {
  trades: Trade[]
}

export function DurationAnalysis({ trades }: DurationAnalysisProps) {
  const stats = useMemo(() => calculateDurationStats(trades), [trades])
  const distribution = useMemo(() => getDurationDistribution(trades), [trades])

  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
        No trades available for duration analysis
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Trade Duration</h3>
      </div>
      <div className="p-5 space-y-5">
        {/* Summary Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <StatItem label="Avg" value={formatDuration(stats.average)} />
          <StatItem label="Median" value={formatDuration(stats.median)} />
          <StatItem label="Min" value={formatDuration(stats.min)} />
          <StatItem label="Max" value={formatDuration(stats.max)} />
        </div>

        {/* Distribution Histogram */}
        <ChartContainer config={{}} className="h-[180px] w-full">
          <BarChart data={distribution} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              itemStyle={{ color: "var(--foreground)" }}
              formatter={(value: number) => [`${value} trades`, "Count"]}
            />
            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>

        {/* By Direction */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Long Avg</div>
            <div className="text-sm font-mono font-medium text-foreground">
              {formatDuration(stats.byDirection.long)}
            </div>
          </div>
          <div className="rounded-md border border-border p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Short Avg</div>
            <div className="text-sm font-mono font-medium text-foreground">
              {formatDuration(stats.byDirection.short)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-mono font-medium text-foreground">{value}</div>
    </div>
  )
}
