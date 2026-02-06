"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { DurationStats, formatDuration, getDurationDistribution } from "@/lib/analytics/risk"
import { Trade } from "@/lib/mock/trades"

interface DurationAnalysisProps {
  stats: DurationStats
  trades: Trade[]
}

export function DurationAnalysis({ stats, trades }: DurationAnalysisProps) {
  const { average, median, min, max, byDirection } = stats
  const distribution = getDurationDistribution(trades)

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono">{formatDuration(average)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Median
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono">{formatDuration(median)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Shortest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono">{formatDuration(min)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Longest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono">{formatDuration(max)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Direction Comparison */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Duration by Direction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-success">Long Trades</div>
              <div className="text-2xl font-bold font-mono">{formatDuration(byDirection.long)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-destructive">Short Trades</div>
              <div className="text-2xl font-bold font-mono">{formatDuration(byDirection.short)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Histogram */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Duration Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="range" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151B2B",
                    border: "1px solid #2D3748",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#5471f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
