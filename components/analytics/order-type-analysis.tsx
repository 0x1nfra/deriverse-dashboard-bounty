"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, Shield, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/mock/trades"
import { calculateOrderTypeStats, getOrderTypeDistribution, getOrderTypeChartData } from "@/lib/analytics/order-type"
import { cn } from "@/lib/utils"
import type { Trade } from "@/lib/mock/trades"

interface OrderTypeAnalysisProps {
  trades: Trade[]
}

const chartConfig = {
  market: { label: "Market", color: "#5471f6" },
  limit: { label: "Limit", color: "#38bdf8" },
  stop: { label: "Stop", color: "#a78bfa" },
}

export function OrderTypeAnalysis({ trades }: OrderTypeAnalysisProps) {
  const stats = useMemo(() => calculateOrderTypeStats(trades), [trades])
  const distribution = useMemo(() => getOrderTypeDistribution(trades), [trades])
  const chartData = useMemo(() => getOrderTypeChartData(trades), [trades])

  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
        No trades available for order type analysis
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OrderTypeCard
          type="market"
          label="Market Orders"
          icon={Zap}
          stats={stats.market}
          isBest={stats.bestPerforming === "market"}
          isWorst={stats.worstPerforming === "market"}
        />
        <OrderTypeCard
          type="limit"
          label="Limit Orders"
          icon={Target}
          stats={stats.limit}
          isBest={stats.bestPerforming === "limit"}
          isWorst={stats.worstPerforming === "limit"}
        />
        <OrderTypeCard
          type="stop"
          label="Stop Orders"
          icon={Shield}
          stats={stats.stop}
          isBest={stats.bestPerforming === "stop"}
          isWorst={stats.worstPerforming === "stop"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PnL Comparison Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PnL by Order Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                  itemStyle={{ color: "var(--foreground)" }}
                  formatter={(value: number) => [formatCurrency(value), "PnL"]}
                />
                <Bar
                  dataKey="pnl"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.pnl >= 0 ? "#10B981" : "#EF4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribution and Win Rate */}
        <div className="space-y-4">
          {/* Distribution Donut Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Order Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {distribution.map((entry, index) => (
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
                      const item = distribution.find((d) => d.name === value)
                      return (
                        <span className="text-sm text-foreground">
                          {value}{" "}
                          <span className="text-muted-foreground">
                            {item?.percentage}%
                          </span>
                        </span>
                      )
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Win Rate Comparison */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Win Rate by Order Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chartData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.name}</span>
                    <span className={cn(
                      "font-mono",
                      item.winRate >= 50 ? "text-success" : "text-destructive"
                    )}>
                      {item.winRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={item.winRate} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.count} trades</span>
                    <span>Avg: {formatCurrency(item.avgPnl)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface OrderTypeCardProps {
  type: "market" | "limit" | "stop"
  label: string
  icon: React.ElementType
  stats: {
    count: number
    pnl: number
    winRate: number
    avgPnl: number
  }
  isBest: boolean
  isWorst: boolean
}

function OrderTypeCard({ type, label, icon: Icon, stats, isBest, isWorst }: OrderTypeCardProps) {
  const colors = {
    market: "text-blue-500",
    limit: "text-green-500",
    stop: "text-orange-500",
  }

  return (
    <Card className={cn(
      "bg-card border-border relative overflow-hidden",
      isBest && "border-success/50",
      isWorst && "border-destructive/50"
    )}>
      {(isBest || isWorst) && (
        <div className={cn(
          "absolute top-2 right-2",
          isBest ? "text-success" : "text-destructive"
        )}>
          {isBest ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className={cn("h-4 w-4", colors[type])} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={cn(
          "text-2xl font-bold font-mono",
          stats.pnl >= 0 ? "text-success" : "text-destructive"
        )}>
          {stats.pnl >= 0 ? "+" : ""}{formatCurrency(stats.pnl)}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Win Rate</span>
          <span className={cn(
            "font-mono",
            stats.winRate >= 50 ? "text-success" : "text-destructive"
          )}>
            {stats.winRate.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{stats.count} trades</span>
          <span>Avg: {formatCurrency(stats.avgPnl)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
