"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  calculateRecoveryPeriods,
  type RecoveryPeriod,
  type PortfolioDataPoint,
} from "@/lib/analytics/drawdown"
import { Clock, Zap, TrendingDown } from "lucide-react"

function formatDays(days: number): string {
  if (days === 0) return "< 1d"
  if (days === 1) return "1 day"
  return `${days} days`
}

interface RecoveryAnalysisProps {
  portfolioData: PortfolioDataPoint[]
}

export function RecoveryAnalysis({ portfolioData }: RecoveryAnalysisProps) {
  const periods = useMemo(() => {
    return calculateRecoveryPeriods(portfolioData)
  }, [portfolioData])

  if (periods.length === 0) return null

  const recoveredPeriods = periods.filter((p) => p.recovered)

  const avgRecoveryTime =
    recoveredPeriods.length > 0
      ? Math.round(
          recoveredPeriods.reduce(
            (sum, p) => sum + (p.recoveryDuration ?? 0),
            0
          ) / recoveredPeriods.length
        )
      : null

  const fastestRecovery =
    recoveredPeriods.length > 0
      ? Math.min(
          ...recoveredPeriods.map((p) => p.recoveryDuration ?? Infinity)
        )
      : null

  const deepestDrawdown = Math.max(...periods.map((p) => p.depth))

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Recovery Analysis
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-muted/30 border-border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Avg Recovery
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold font-mono text-foreground">
                {avgRecoveryTime !== null
                  ? formatDays(avgRecoveryTime)
                  : "—"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Fastest Recovery
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold font-mono text-success">
                {fastestRecovery !== null
                  ? formatDays(fastestRecovery)
                  : "—"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5" />
                Deepest Drawdown
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold font-mono text-destructive">
                -{deepestDrawdown.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recovery Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Peak
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Trough
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Depth
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  DD Duration
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recovery
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period, index) => (
                <RecoveryRow key={index} period={period} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RecoveryRow({ period }: { period: RecoveryPeriod }) {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="py-2.5 px-3 font-mono text-foreground">
        {period.peakDate}
      </td>
      <td className="py-2.5 px-3 font-mono text-foreground">
        {period.troughDate}
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-destructive font-medium">
        -{period.depth.toFixed(2)}%
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-foreground">
        {formatDays(period.drawdownDuration)}
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-foreground">
        {period.recoveryDuration !== null
          ? formatDays(period.recoveryDuration)
          : "—"}
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-foreground">
        {period.totalDuration !== null
          ? formatDays(period.totalDuration)
          : "—"}
      </td>
      <td className="py-2.5 px-3 text-right">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            period.recovered
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          )}
        >
          {period.recovered ? "Recovered" : "Active"}
        </span>
      </td>
    </tr>
  )
}
