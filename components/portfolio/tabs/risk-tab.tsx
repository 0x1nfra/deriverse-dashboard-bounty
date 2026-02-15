"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExtremeTradesCard } from "@/components/risk/extreme-trades-card"
import { DrawdownChart } from "@/components/risk/drawdown-chart"
import { RollingSharpeChart } from "@/components/risk/rolling-sharpe-chart"
import { RecoveryAnalysis } from "@/components/risk/recovery-analysis"
import { RiskRewardScatter } from "@/components/risk/risk-reward-scatter"
import { StreakAnalysis } from "@/components/risk/streak-analysis"
import { PnlDistribution } from "@/components/risk/pnl-distribution"
import { SymbolExposure } from "@/components/risk/symbol-exposure"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { useFilters } from "@/hooks/use-filters"
import { NoTradesState, NoFilterResultsState } from "@/components/empty-states"
import {
  calculateExtremeTrades,
  calculateStreaks,
  getPnlDistribution,
  calculateSymbolExposure,
  calculateSharpeRatio,
  calculateSortinoRatio,
} from "@/lib/analytics/risk"
import {
  calculateMaxDrawdown,
  calculateCurrentDrawdown,
} from "@/lib/analytics/drawdown"
import { TrendingDown, Activity, BarChart3, Shield } from "lucide-react"

export function RiskTabContent() {
  const { filteredTrades, isLoading } = useFilteredTrades(false)
  const { resetFilters, isDefault } = useFilters()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const extremeTrades = useMemo(
    () => calculateExtremeTrades(filteredTrades),
    [filteredTrades]
  )

  const streaks = useMemo(
    () => calculateStreaks(filteredTrades),
    [filteredTrades]
  )

  const pnlDistribution = useMemo(
    () => getPnlDistribution(filteredTrades),
    [filteredTrades]
  )

  const symbolExposure = useMemo(
    () => calculateSymbolExposure(filteredTrades),
    [filteredTrades]
  )

  const sharpeRatio = useMemo(
    () => calculateSharpeRatio(filteredTrades),
    [filteredTrades]
  )

  const sortinoRatio = useMemo(
    () => calculateSortinoRatio(filteredTrades),
    [filteredTrades]
  )

  const drawdownMetrics = useMemo(() => {
    if (filteredTrades.length === 0) {
      return {
        maxDrawdown: null,
        currentDrawdown: null,
        portfolioData: [],
      }
    }

    // Sort trades by timestamp and build equity curve from cumulative PnL
    const sortedTrades = [...filteredTrades].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    )

    // Add starting capital offset to ensure positive values for drawdown math
    const startingCapital = 10000
    let runningPnl = 0
    const portfolioData = sortedTrades.map((trade) => {
      runningPnl += trade.pnl
      return {
        date: trade.timestamp.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: startingCapital + runningPnl,
        timestamp: trade.timestamp.getTime(),
      }
    })

    return {
      maxDrawdown: calculateMaxDrawdown(portfolioData),
      currentDrawdown: calculateCurrentDrawdown(portfolioData),
      portfolioData,
    }
  }, [filteredTrades])

  if (!isLoading && isClient && filteredTrades.length === 0) {
    if (isDefault) {
      return (
        <div className="space-y-6">
          <NoTradesState />
        </div>
      )
    }
    return (
      <div className="space-y-6">
        <NoFilterResultsState onClearFilters={resetFilters} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Risk Summary Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Max Drawdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-destructive">
              {drawdownMetrics.maxDrawdown
                ? `-${drawdownMetrics.maxDrawdown.percentage.toFixed(2)}%`
                : "—"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-warning" />
              Current Drawdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-warning">
              {drawdownMetrics.currentDrawdown
                ? `-${drawdownMetrics.currentDrawdown.percentage.toFixed(2)}%`
                : "0.00%"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Sharpe Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              {sharpeRatio === null ? "—" : sharpeRatio.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Sortino Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              {sortinoRatio === null
                ? "—"
                : sortinoRatio === Infinity
                  ? "∞"
                  : sortinoRatio.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Drawdown Chart */}
      <section>
        <DrawdownChart portfolioData={drawdownMetrics.portfolioData} />
      </section>

      {/* Section 3: Rolling Sharpe Chart */}
      <section>
        <RollingSharpeChart trades={filteredTrades} />
      </section>

      {/* Section 4: Recovery Analysis */}
      <section>
        <RecoveryAnalysis portfolioData={drawdownMetrics.portfolioData} />
      </section>

      {/* Section 5: Extreme Trades */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Extreme Trades
        </h3>
        <ExtremeTradesCard data={extremeTrades} />
      </section>

      {/* Section 6: Streak Analysis */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Streak Analysis
        </h3>
        <StreakAnalysis data={streaks} />
      </section>

      {/* Section 7: Risk/Reward Scatter */}
      <section>
        <RiskRewardScatter trades={filteredTrades} />
      </section>

      {/* Section 8: PnL Distribution */}
      <section>
        <PnlDistribution data={pnlDistribution} />
      </section>

      {/* Section 9: Risk Exposure by Symbol */}
      <section>
        <SymbolExposure data={symbolExposure} />
      </section>
    </div>
  )
}
