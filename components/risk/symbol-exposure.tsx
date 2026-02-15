"use client"

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
import { formatCurrency } from "@/lib/mock/trades"
import { SymbolExposure as SymbolExposureData } from "@/lib/analytics/risk"

interface SymbolExposureProps {
  data: SymbolExposureData[]
}

interface ExposureTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: SymbolExposureData
  }>
}

function ExposureTooltip({ active, payload }: ExposureTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const isNetPositive = data.netPnl >= 0
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[160px]">
        <p className="text-sm font-medium font-mono text-foreground mb-2">{data.symbol}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Exposure:</span>
            <span className="text-sm font-mono font-semibold text-foreground">
              {formatCurrency(data.totalAbsPnl)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Net PnL:</span>
            <span className={`text-sm font-mono font-medium ${isNetPositive ? "text-success" : "text-destructive"}`}>
              {isNetPositive ? "+" : ""}{formatCurrency(data.netPnl)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Trades:</span>
            <span className="text-sm font-mono text-foreground">{data.tradeCount}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const chartConfig = {
  totalAbsPnl: {
    label: "Exposure",
    color: "var(--primary)",
  },
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
]

export function SymbolExposure({ data }: SymbolExposureProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Risk Exposure by Symbol
        </h3>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                horizontal={false}
                opacity={0.5}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => formatCurrency(value)}
              />

              <YAxis
                type="category"
                dataKey="symbol"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono, monospace)" }}
                width={80}
              />

              <Tooltip content={<ExposureTooltip />} />

              <Bar dataKey="totalAbsPnl" radius={[0, 4, 4, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
