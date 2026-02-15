"use client"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Trade } from "@/lib/mock/trades"

interface ScatterPoint {
  duration: number
  pnlPercent: number
  size: number
  symbol: string
  side: string
}

interface ScatterTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: ScatterPoint
  }>
}

function ScatterTooltip({ active, payload }: ScatterTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[160px]">
        <p className="text-sm font-medium text-foreground mb-1">
          {data.symbol} ({data.side})
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Duration:</span>
            <span className="text-sm font-mono font-semibold text-foreground">
              {data.duration.toFixed(1)}h
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">PnL:</span>
            <span
              className={`text-sm font-mono font-semibold ${
                data.pnlPercent >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {data.pnlPercent >= 0 ? "+" : ""}
              {data.pnlPercent.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Size:</span>
            <span className="text-sm font-mono font-semibold text-foreground">
              ${data.size.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const chartConfig = {
  scatter: {
    label: "Risk/Reward",
    color: "var(--primary)",
  },
}

interface RiskRewardScatterProps {
  trades: Trade[]
}

export function RiskRewardScatter({ trades }: RiskRewardScatterProps) {
  const data: ScatterPoint[] = trades.map((trade) => ({
    duration: trade.duration / 60,
    pnlPercent: trade.pnlPercentage,
    size: trade.size,
    symbol: trade.symbol,
    side: trade.side,
  }))

  if (data.length === 0) return null

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Risk / Reward Scatter
        </h3>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                opacity={0.5}
              />

              <XAxis
                dataKey="duration"
                type="number"
                name="Duration"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => `${value}h`}
                label={{
                  value: "Duration (hours)",
                  position: "insideBottom",
                  offset: -5,
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />

              <YAxis
                dataKey="pnlPercent"
                type="number"
                name="PnL %"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
                width={50}
              />

              <ZAxis
                dataKey="size"
                type="number"
                range={[40, 200]}
                name="Size"
              />

              <ReferenceLine
                y={0}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />

              <Tooltip content={<ScatterTooltip />} />

              <Scatter data={data} animationDuration={800}>
                {data.map((point, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      point.pnlPercent >= 0
                        ? "var(--success)"
                        : "var(--destructive)"
                    }
                    fillOpacity={0.7}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
