import { Trade } from "@/lib/mock/trades"

export interface ExtremeTrades {
  largestGain: {
    trade: Trade
    pnl: number
  } | null
  largestLoss: {
    trade: Trade
    pnl: number
  } | null
}

export interface WinLossStats {
  avgWin: number
  avgLoss: number
  totalWins: number
  totalLosses: number
  winRate: number
  riskRewardRatio: number
  profitFactor: number
}

export interface DirectionalBias {
  longCount: number
  shortCount: number
  longPercentage: number
  shortPercentage: number
  longPnL: number
  shortPnL: number
}

export interface DurationStats {
  average: number
  median: number
  min: number
  max: number
  bySymbol: Record<string, number>
  byDirection: {
    long: number
    short: number
  }
}

export function calculateExtremeTrades(trades: Trade[]): ExtremeTrades {
  if (trades.length === 0) {
    return { largestGain: null, largestLoss: null }
  }

  const sortedByPnL = [...trades].sort((a, b) => b.pnl - a.pnl)
  
  const largestGain = sortedByPnL[0]
  const largestLoss = sortedByPnL[sortedByPnL.length - 1]

  return {
    largestGain: largestGain.pnl > 0 ? { trade: largestGain, pnl: largestGain.pnl } : null,
    largestLoss: largestLoss.pnl < 0 ? { trade: largestLoss, pnl: largestLoss.pnl } : null,
  }
}

export function calculateWinLossStats(trades: Trade[]): WinLossStats {
  if (trades.length === 0) {
    return {
      avgWin: 0,
      avgLoss: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      riskRewardRatio: 0,
      profitFactor: 0,
    }
  }

  const winningTrades = trades.filter((t) => t.pnl > 0)
  const losingTrades = trades.filter((t) => t.pnl < 0)

  const totalWins = winningTrades.length
  const totalLosses = losingTrades.length

  // Compute grossProfit, grossLoss, avgWin, and avgLoss first
  const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0)
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0))

  const avgWin = totalWins > 0
    ? grossProfit / totalWins
    : 0

  const avgLoss = totalLosses > 0
    ? grossLoss / totalLosses
    : 0

  const winRate = trades.length > 0 ? (totalWins / trades.length) * 100 : 0

  // Assign riskRewardRatio based on edge cases
  let riskRewardRatio: number
  if (avgLoss === 0 && avgWin > 0) {
    riskRewardRatio = Infinity
  } else if (avgWin === 0 && avgLoss > 0) {
    riskRewardRatio = 0
  } else {
    riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : 0
  }

  // Assign profitFactor based on edge cases
  let profitFactor: number
  if (grossLoss === 0 && grossProfit > 0) {
    profitFactor = Infinity
  } else if (grossProfit === 0 && grossLoss > 0) {
    profitFactor = 0
  } else {
    profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0
  }

  return {
    avgWin,
    avgLoss,
    totalWins,
    totalLosses,
    winRate,
    riskRewardRatio,
    profitFactor,
  }
}

export function calculateDirectionalBias(trades: Trade[]): DirectionalBias {
  if (trades.length === 0) {
    return {
      longCount: 0,
      shortCount: 0,
      longPercentage: 0,
      shortPercentage: 0,
      longPnL: 0,
      shortPnL: 0,
    }
  }

  const longTrades = trades.filter((t) => t.side === "long")
  const shortTrades = trades.filter((t) => t.side === "short")

  const longCount = longTrades.length
  const shortCount = shortTrades.length
  const total = trades.length

  const longPnL = longTrades.reduce((sum, t) => sum + t.pnl, 0)
  const shortPnL = shortTrades.reduce((sum, t) => sum + t.pnl, 0)

  return {
    longCount,
    shortCount,
    longPercentage: total > 0 ? (longCount / total) * 100 : 0,
    shortPercentage: total > 0 ? (shortCount / total) * 100 : 0,
    longPnL,
    shortPnL,
  }
}

export function calculateDurationStats(trades: Trade[]): DurationStats {
  if (trades.length === 0) {
    return {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      bySymbol: {},
      byDirection: { long: 0, short: 0 },
    }
  }

  const durations = trades.map((t) => t.duration)
  const sortedDurations = [...durations].sort((a, b) => a - b)

  const average = durations.reduce((sum, d) => sum + d, 0) / durations.length
  const median = sortedDurations[Math.floor(sortedDurations.length / 2)]
  const min = sortedDurations[0]
  const max = sortedDurations[sortedDurations.length - 1]

  // Duration by symbol
  const bySymbol: Record<string, number> = {}
  const symbolDurations: Record<string, number[]> = {}

  trades.forEach((t) => {
    if (!symbolDurations[t.symbol]) {
      symbolDurations[t.symbol] = []
    }
    symbolDurations[t.symbol].push(t.duration)
  })

  Object.entries(symbolDurations).forEach(([symbol, durs]) => {
    bySymbol[symbol] = durs.reduce((sum, d) => sum + d, 0) / durs.length
  })

  // Duration by direction
  const longTrades = trades.filter((t) => t.side === "long")
  const shortTrades = trades.filter((t) => t.side === "short")

  const byDirection = {
    long: longTrades.length > 0 
      ? longTrades.reduce((sum, t) => sum + t.duration, 0) / longTrades.length 
      : 0,
    short: shortTrades.length > 0 
      ? shortTrades.reduce((sum, t) => sum + t.duration, 0) / shortTrades.length 
      : 0,
  }

  return {
    average,
    median,
    min,
    max,
    bySymbol,
    byDirection,
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  } else {
    const days = Math.floor(minutes / 1440)
    const hours = Math.floor((minutes % 1440) / 60)
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`
  }
}

export function getDurationDistribution(trades: Trade[]): { range: string; count: number }[] {
  if (trades.length === 0) return []

  const ranges = [
    { label: "< 1h", min: 0, max: 60 },
    { label: "1-4h", min: 60, max: 240 },
    { label: "4-12h", min: 240, max: 720 },
    { label: "12-24h", min: 720, max: 1440 },
    { label: "1-3d", min: 1440, max: 4320 },
    { label: "3d+", min: 4320, max: Infinity },
  ]

  return ranges.map((range) => ({
    range: range.label,
    count: trades.filter((t) => t.duration >= range.min && t.duration < range.max).length,
  }))
}

export interface StreakData {
  currentStreak: number
  currentStreakType: "win" | "loss" | "none"
  maxWinStreak: number
  maxLossStreak: number
}

export function calculateStreaks(trades: Trade[]): StreakData {
  if (trades.length === 0) {
    return { currentStreak: 0, currentStreakType: "none", maxWinStreak: 0, maxLossStreak: 0 }
  }

  const sorted = [...trades].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  )

  let maxWinStreak = 0
  let maxLossStreak = 0
  let currentWinStreak = 0
  let currentLossStreak = 0

  for (const trade of sorted) {
    if (trade.pnl > 0) {
      currentWinStreak++
      currentLossStreak = 0
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak)
    } else if (trade.pnl < 0) {
      currentLossStreak++
      currentWinStreak = 0
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak)
    } else {
      currentWinStreak = 0
      currentLossStreak = 0
    }
  }

  const currentStreakType = currentWinStreak > 0 ? "win" : currentLossStreak > 0 ? "loss" : "none"
  const currentStreak = currentWinStreak > 0 ? currentWinStreak : currentLossStreak

  return { currentStreak, currentStreakType, maxWinStreak, maxLossStreak }
}

export interface PnlBucket {
  range: string
  count: number
  minVal: number
  maxVal: number
}

export function getPnlDistribution(trades: Trade[]): PnlBucket[] {
  if (trades.length === 0) return []

  const buckets = [
    { range: "< -5%", minVal: -Infinity, maxVal: -5 },
    { range: "-5% to -2%", minVal: -5, maxVal: -2 },
    { range: "-2% to 0%", minVal: -2, maxVal: 0 },
    { range: "0% to 2%", minVal: 0, maxVal: 2 },
    { range: "2% to 5%", minVal: 2, maxVal: 5 },
    { range: "> 5%", minVal: 5, maxVal: Infinity },
  ]

  return buckets.map((bucket) => ({
    range: bucket.range,
    count: trades.filter(
      (t) => t.pnlPercentage >= bucket.minVal && t.pnlPercentage < bucket.maxVal
    ).length,
    minVal: bucket.minVal,
    maxVal: bucket.maxVal,
  }))
}

export interface SymbolExposure {
  symbol: string
  totalAbsPnl: number
  tradeCount: number
  netPnl: number
}

export function calculateSymbolExposure(trades: Trade[]): SymbolExposure[] {
  if (trades.length === 0) return []

  const symbolMap = new Map<string, { totalAbsPnl: number; tradeCount: number; netPnl: number }>()

  for (const trade of trades) {
    const existing = symbolMap.get(trade.symbol) || { totalAbsPnl: 0, tradeCount: 0, netPnl: 0 }
    existing.totalAbsPnl += Math.abs(trade.pnl)
    existing.tradeCount++
    existing.netPnl += trade.pnl
    symbolMap.set(trade.symbol, existing)
  }

  return Array.from(symbolMap.entries())
    .map(([symbol, data]) => ({ symbol, ...data }))
    .sort((a, b) => b.totalAbsPnl - a.totalAbsPnl)
}

export function calculateSharpeRatio(trades: Trade[]): number | null {
  if (trades.length < 2) return null

  const returns = trades.map((t) => t.pnlPercentage)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / (returns.length - 1)
  const stdDev = Math.sqrt(variance)

  if (stdDev === 0) return null
  return avgReturn / stdDev
}

export function calculateSortinoRatio(trades: Trade[]): number | null {
  if (trades.length < 2) return null

  const returns = trades.map((t) => t.pnlPercentage)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const negativeReturns = returns.filter((r) => r < 0)

  if (negativeReturns.length === 0) return avgReturn > 0 ? Infinity : 0

  const downsideVariance =
    negativeReturns.reduce((sum, r) => sum + r ** 2, 0) / negativeReturns.length
  const downsideDev = Math.sqrt(downsideVariance)

  if (downsideDev === 0) return null
  return avgReturn / downsideDev
}

export interface RollingSharpePoint {
  date: string
  sharpe: number
}

export function calculateRollingSharpe(
  trades: Trade[],
  windowSize: number = 30
): RollingSharpePoint[] {
  if (trades.length < windowSize) return []

  const sorted = [...trades].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  )

  const points: RollingSharpePoint[] = []

  for (let i = windowSize; i <= sorted.length; i++) {
    const window = sorted.slice(i - windowSize, i)
    const sharpe = calculateSharpeRatio(window)
    const lastTrade = window[window.length - 1]

    points.push({
      date: lastTrade.timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      sharpe: sharpe !== null ? Math.round(sharpe * 100) / 100 : 0,
    })
  }

  return points
}
