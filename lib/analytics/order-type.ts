import { Trade } from "@/lib/mock/trades"

export interface OrderTypeMetrics {
  count: number
  pnl: number
  winRate: number
  avgPnl: number
  totalWins: number
  totalLosses: number
}

export interface OrderTypeStats {
  market: OrderTypeMetrics
  limit: OrderTypeMetrics
  stop: OrderTypeMetrics
  total: number
  bestPerforming: "market" | "limit" | "stop" | null
  worstPerforming: "market" | "limit" | "stop" | null
}

export interface OrderTypeDistribution {
  name: string
  value: number
  percentage: number
  color: string
}

export function calculateOrderTypeStats(trades: Trade[]): OrderTypeStats {
  if (trades.length === 0) {
    return {
      market: { count: 0, pnl: 0, winRate: 0, avgPnl: 0, totalWins: 0, totalLosses: 0 },
      limit: { count: 0, pnl: 0, winRate: 0, avgPnl: 0, totalWins: 0, totalLosses: 0 },
      stop: { count: 0, pnl: 0, winRate: 0, avgPnl: 0, totalWins: 0, totalLosses: 0 },
      total: 0,
      bestPerforming: null,
      worstPerforming: null,
    }
  }

  // Initialize metrics for each order type
  const metrics: Record<string, OrderTypeMetrics> = {
    market: { count: 0, pnl: 0, winRate: 0, avgPnl: 0, totalWins: 0, totalLosses: 0 },
    limit: { count: 0, pnl: 0, winRate: 0, avgPnl: 0, totalWins: 0, totalLosses: 0 },
    stop: { count: 0, pnl: 0, winRate: 0, avgPnl: 0, totalWins: 0, totalLosses: 0 },
  }

  // Calculate metrics for each order type
  trades.forEach((trade) => {
    const type = trade.orderType
    metrics[type].count++
    metrics[type].pnl += trade.pnl

    if (trade.pnl > 0) {
      metrics[type].totalWins++
    } else if (trade.pnl < 0) {
      metrics[type].totalLosses++
    }
  })

  // Calculate win rates and average PnL
  ;(["market", "limit", "stop"] as const).forEach((type) => {
    const m = metrics[type]
    m.winRate = m.count > 0 ? (m.totalWins / m.count) * 100 : 0
    m.avgPnl = m.count > 0 ? m.pnl / m.count : 0

    // Round to 2 decimal places
    m.pnl = Math.round(m.pnl * 100) / 100
    m.winRate = Math.round(m.winRate * 100) / 100
    m.avgPnl = Math.round(m.avgPnl * 100) / 100
  })

  // Determine best and worst performing
  const types = ["market", "limit", "stop"] as const
  const sortedByPnl = types
    .filter((type) => metrics[type].count > 0)
    .sort((a, b) => metrics[b].pnl - metrics[a].pnl)

  const bestPerforming = sortedByPnl.length > 0 ? sortedByPnl[0] : null
  const worstPerforming = sortedByPnl.length > 0 ? sortedByPnl[sortedByPnl.length - 1] : null

  return {
    market: metrics.market,
    limit: metrics.limit,
    stop: metrics.stop,
    total: trades.length,
    bestPerforming,
    worstPerforming,
  }
}

export function getOrderTypeDistribution(trades: Trade[]): OrderTypeDistribution[] {
  if (trades.length === 0) {
    return []
  }

  const stats = calculateOrderTypeStats(trades)
  const total = stats.total

  const colors = {
    market: "#5471f6", // Blue
    limit: "#06B6D4", // Cyan
    stop: "#8B5CF6", // Purple
  }

  return [
    {
      name: "Market",
      value: stats.market.count,
      percentage: total > 0 ? Math.round((stats.market.count / total) * 10000) / 100 : 0,
      color: colors.market,
    },
    {
      name: "Limit",
      value: stats.limit.count,
      percentage: total > 0 ? Math.round((stats.limit.count / total) * 10000) / 100 : 0,
      color: colors.limit,
    },
    {
      name: "Stop",
      value: stats.stop.count,
      percentage: total > 0 ? Math.round((stats.stop.count / total) * 10000) / 100 : 0,
      color: colors.stop,
    },
  ]
}

export function getOrderTypeChartData(trades: Trade[]) {
  const stats = calculateOrderTypeStats(trades)

  return [
    {
      name: "Market",
      pnl: stats.market.pnl,
      winRate: stats.market.winRate,
      count: stats.market.count,
      avgPnl: stats.market.avgPnl,
    },
    {
      name: "Limit",
      pnl: stats.limit.pnl,
      winRate: stats.limit.winRate,
      count: stats.limit.count,
      avgPnl: stats.limit.avgPnl,
    },
    {
      name: "Stop",
      pnl: stats.stop.pnl,
      winRate: stats.stop.winRate,
      count: stats.stop.count,
      avgPnl: stats.stop.avgPnl,
    },
  ]
}
