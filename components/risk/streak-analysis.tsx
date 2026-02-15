"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Trophy, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { StreakData } from "@/lib/analytics/risk"

interface StreakAnalysisProps {
  data: StreakData
}

export function StreakAnalysis({ data }: StreakAnalysisProps) {
  const { currentStreak, currentStreakType, maxWinStreak, maxLossStreak } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Flame className={cn(
              "h-4 w-4",
              currentStreakType === "win" ? "text-success" : currentStreakType === "loss" ? "text-destructive" : "text-muted-foreground"
            )} />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "text-2xl font-bold font-mono",
            currentStreakType === "win" ? "text-success" : currentStreakType === "loss" ? "text-destructive" : "text-muted-foreground"
          )}>
            {currentStreak > 0 ? currentStreak : "—"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentStreakType === "win"
              ? "consecutive wins"
              : currentStreakType === "loss"
                ? "consecutive losses"
                : "no active streak"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Trophy className="h-4 w-4 text-success" />
            Max Win Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-success">
            {maxWinStreak}
          </div>
          <p className="text-xs text-muted-foreground mt-1">consecutive wins</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Max Loss Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-destructive">
            {maxLossStreak}
          </div>
          <p className="text-xs text-muted-foreground mt-1">consecutive losses</p>
        </CardContent>
      </Card>
    </div>
  )
}
