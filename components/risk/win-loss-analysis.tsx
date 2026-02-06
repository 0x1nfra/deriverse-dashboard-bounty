"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/mock/trades"
import { WinLossStats } from "@/lib/analytics/risk"
import { cn } from "@/lib/utils"

interface WinLossAnalysisProps {
  data: WinLossStats
}

export function WinLossAnalysis({ data }: WinLossAnalysisProps) {
  const { avgWin, avgLoss, totalWins, totalLosses, winRate, riskRewardRatio, profitFactor } = data

  return (
    <div className="space-y-4">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Win */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Win
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-success">
              {formatCurrency(avgWin)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalWins} winning trades
            </div>
          </CardContent>
        </Card>

        {/* Average Loss */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-destructive">
              {formatCurrency(avgLoss)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalLosses} losing trades
            </div>
          </CardContent>
        </Card>

        {/* Risk:Reward Ratio */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Risk:Reward Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold font-mono",
              riskRewardRatio >= 1.5 ? "text-success" : riskRewardRatio >= 1 ? "text-yellow-500" : "text-destructive"
            )}>
              {riskRewardRatio.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {riskRewardRatio >= 1.5 ? "Good" : riskRewardRatio >= 1 ? "Fair" : "Poor"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Win Rate and Profit Factor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Win Rate */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-mono">{winRate.toFixed(1)}%</span>
              <span className="text-sm text-muted-foreground">
                {totalWins}W / {totalLosses}L
              </span>
            </div>
            <Progress 
              value={winRate} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>

        {/* Profit Factor */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profit Factor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-2xl font-bold font-mono",
                profitFactor >= 1.5 ? "text-success" : profitFactor >= 1 ? "text-yellow-500" : "text-destructive"
              )}>
                {profitFactor.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                Gross Profit / Gross Loss
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {profitFactor >= 2 ? "Excellent" : profitFactor >= 1.5 ? "Good" : profitFactor >= 1 ? "Break-even" : "Losing"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
