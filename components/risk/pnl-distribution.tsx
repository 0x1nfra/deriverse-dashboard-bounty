"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { PnlBucket } from "@/lib/analytics/risk"

interface PnlDistributionProps {
  data: PnlBucket[]
}

interface DistributionTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: PnlBucket
  }>
}

function DistributionTooltip({ active, payload }: DistributionTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[140px]">
        <p className="text-sm font-medium text-foreground mb-1">{data.range}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Trades:</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            {data.count}
          </span>
        </div>
      </div>
    )
  }
  return null
}

const chartConfig = {
  count: {
    label: "Trade Count",
    color: "var(--primary)",
  },
}

export function PnlDistribution({ data }: PnlDistributionProps) {
  const colors = useMemo(
    () =>
      data.map((bucket) => {
        if (bucket.maxVal <= 0) return "var(--destructive)"
        if (bucket.minVal >= 0) return "var(--success)"
        return "var(--muted-foreground)"
      }),
    [data]
  )

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          PnL Distribution
        </h3>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                vertical={false}
                opacity={0.5}
              />

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

              <Tooltip content={<DistributionTooltip />} />

              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
