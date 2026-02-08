"use client"

// Client-only mock trade data hook
// Generates trades only on the client to avoid SSR hydration mismatches
// Now with realistic market regimes to create visible drawdown periods

import { useState, useEffect } from "react"

export interface Trade {
  id: string
  symbol: string
  side: "long" | "short"
  orderType: "market" | "limit" | "stop"
  size: number
  entryPrice: number
  exitPrice: number
  pnl: number
  pnlPercentage: number
  grossPnlPercentage: number
  netPnlPercentage: number
  fees: {
    maker: number
    taker: number
    funding: number
  }
  timestamp: Date
  duration: number // in minutes
}

// Trading symbols
const symbols = ["SOL", "ETH", "BTC", "BONK", "JUP", "WIF", "PEPE", "DOGE"]

// Fee rates (realistic for perp DEX)
const FEE_RATES = {
  maker: 0.0002, // 0.02%
  taker: 0.0005, // 0.05%
  funding: 0.0001, // 0.01% per 8 hours
}

// Market phases to create realistic drawdown periods
// Each phase has different win rates and volatility
// Updated win rates: 45-58% (more realistic for professional traders)
const MARKET_PHASES = [
  { days: 15, winRate: 0.58, volatility: 0.08, name: "bull_run", tradesPerDay: [4, 8] },       // Strong uptrend (was 75%)
  { days: 12, winRate: 0.35, volatility: 0.12, name: "correction", tradesPerDay: [6, 12] },   // First drawdown
  { days: 18, winRate: 0.55, volatility: 0.10, name: "recovery_1", tradesPerDay: [5, 10] },   // Recovery (was 65%)
  { days: 15, winRate: 0.30, volatility: 0.15, name: "bear_market", tradesPerDay: [8, 15] }, // Major drawdown
  { days: 20, winRate: 0.52, volatility: 0.09, name: "recovery_2", tradesPerDay: [4, 9] },    // Final recovery (was 60%)
  { days: 10, winRate: 0.45, volatility: 0.11, name: "chop", tradesPerDay: [3, 7] },         // Choppy ending
]

// Generate random number in range
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Generate random integer in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Base prices for different symbols - Updated to current market values (Feb 2025)
const BASE_PRICES: Record<string, number> = {
  SOL: 145,
  ETH: 3200,
  BTC: 98000,
  BONK: 0.000025,
  JUP: 1.2,
  WIF: 0.35,
  PEPE: 0.000015,
  DOGE: 0.15,
}

// Global account balance tracker (shared across all trade generation)
let accountBalance = 50000 // Starting capital: $50k
const RISK_PER_TRADE = 0.02 // 2% risk per trade

// Generate a trade with specific win rate bias
function generateTradeWithBias(
  id: number,
  date: Date,
  winRate: number,
  volatility: number
): Trade {
  const symbol = symbols[randomInt(0, symbols.length - 1)]
  const side: "long" | "short" = Math.random() > 0.5 ? "long" : "short"
  const orderType: "market" | "limit" | "stop" = 
    Math.random() > 0.7 ? "market" : Math.random() > 0.5 ? "limit" : "stop"
  
  const basePrice = BASE_PRICES[symbol]
  const entryPrice = basePrice * (1 + randomInRange(-volatility * 0.5, volatility * 0.5))
  
  // Use the provided win rate instead of fixed 60%
  const isWin = Math.random() < winRate
  const pnlDirection = isWin ? 1 : -1
  
  // During drawdowns (low win rate), make losses bigger and wins smaller
  // During bull runs (high win rate), make wins bigger
  const pnlMultiplier = winRate > 0.52 ? randomInRange(1.0, 1.4) : 
                        winRate < 0.40 ? randomInRange(0.7, 1.0) : 1.0
  
  // Power law distribution for more realistic PnL (favors smaller moves)
  const pnlBaseRaw = Math.pow(Math.random(), 1.8) * 12
  const pnlBase = pnlBaseRaw < 0.3 ? 0.3 : pnlBaseRaw // Minimum 0.3% move
  
  const pnlPercentage = pnlBase * pnlDirection * pnlMultiplier
  
  // Calculate position size based on account balance (2% risk)
  const riskAmount = accountBalance * RISK_PER_TRADE
  const stopLossPercent = randomInRange(0.5, 2.0) // Stop loss between 0.5% and 2%
  const notionalValue = riskAmount / (stopLossPercent / 100)
  const size = notionalValue / entryPrice
  
  // Add slippage for market orders (0.05% to 0.2%)
  const slippage = orderType === "market" ? randomInRange(0.0005, 0.002) : 0
  const slippageImpact = side === "long" ? slippage : -slippage
  const exitPrice = entryPrice * (1 + (pnlPercentage + slippageImpact) / 100)
  
  // Calculate fees
  const isMaker = orderType === "limit"
  const takerFee = isMaker ? 0 : notionalValue * FEE_RATES.taker
  const makerFee = isMaker ? notionalValue * FEE_RATES.maker : 0
  
  // Funding fee (applies to all perp positions, charged every 8 hours)
  const holdTimeHours = randomInRange(1, 72)
  const fundingPeriods = Math.ceil(holdTimeHours / 8)
  const fundingFee = notionalValue * FEE_RATES.funding * fundingPeriods
  
  const totalFees = takerFee + makerFee + fundingFee
  
  // Calculate PnL
  const grossPnL = notionalValue * (pnlPercentage / 100)
  const netPnL = grossPnL - totalFees
  
  // Update account balance with this trade's PnL
  accountBalance += netPnL
  
  // Calculate percentages from respective PnL values
  const grossPnlPercentage = pnlPercentage
  const netPnlPercentage = (netPnL / notionalValue) * 100
  
  return {
    id: `trade-${id.toString().padStart(4, "0")}`,
    symbol,
    side,
    orderType,
    size: Math.round(size * 10000) / 10000,
    entryPrice: Math.round(entryPrice * 1000000) / 1000000,
    exitPrice: Math.round(exitPrice * 1000000) / 1000000,
    pnl: Math.round(netPnL * 100) / 100,
    pnlPercentage: Math.round(netPnlPercentage * 100) / 100,
    grossPnlPercentage: Math.round(grossPnlPercentage * 100) / 100,
    netPnlPercentage: Math.round(netPnlPercentage * 100) / 100,
    fees: {
      maker: Math.round(makerFee * 100) / 100,
      taker: Math.round(takerFee * 100) / 100,
      funding: Math.round(fundingFee * 100) / 100,
    },
    timestamp: date,
    duration: Math.round(holdTimeHours * 60),
  }
}

// Generate trades with market regime awareness
function generateTrades(count: number): Trade[] {
  // Reset account balance for each generation
  accountBalance = 50000
  
  const trades: Trade[] = []
  const now = new Date()
  let tradeId = 1
  let currentDay = 0
  
  // Generate trades phase by phase
  for (const phase of MARKET_PHASES) {
    for (let day = 0; day < phase.days && tradeId <= count; day++) {
      const tradesToday = randomInt(phase.tradesPerDay[0], phase.tradesPerDay[1])
      
      for (let t = 0; t < tradesToday && tradeId <= count; t++) {
        // Create date for this trade (going back from today)
        const tradeDate = new Date(now)
        tradeDate.setDate(tradeDate.getDate() - (90 - currentDay))
        
        // Random time during the day (market hours weighted)
        const hour = randomInt(8, 22) // More trades during active hours
        const minute = randomInt(0, 59)
        tradeDate.setHours(hour, minute, 0, 0)
        
        const trade = generateTradeWithBias(
          tradeId,
          tradeDate,
          phase.winRate,
          phase.volatility
        )
        
        trades.push(trade)
        tradeId++
      }
      
      currentDay++
    }
  }
  
  // Sort by date (newest first)
  trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  
  return trades
}

// Hook for client-only mock trades
export function useMockTrades(count: number = 520): {
  trades: Trade[]
  isLoading: boolean
} {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate trades only on client side
    const generatedTrades = generateTrades(count)
    setTrades(generatedTrades)
    setIsLoading(false)
  }, [count])

  return { trades, isLoading }
}

// Format currency
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

// Format percentage
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

// Calculate volume for a specific time period
export function calculateVolume(trades: Trade[], days: number): number {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  
  return trades
    .filter(trade => trade.timestamp >= cutoffDate)
    .reduce((sum, trade) => sum + trade.size * trade.entryPrice, 0)
}

// Volume metrics interface
export interface VolumeMetrics {
  period24h: number
  period7d: number
  period30d: number
  periodAll: number
  change24h: number
  change7d: number
  change30d: number
}

// Calculate all volume metrics
export function getVolumeMetrics(trades: Trade[]): VolumeMetrics {
  const volume24h = calculateVolume(trades, 1)
  const volume7d = calculateVolume(trades, 7)
  const volume30d = calculateVolume(trades, 30)
  const volumeAll = trades.reduce((sum, trade) => sum + trade.size * trade.entryPrice, 0)
  
  // Calculate changes from previous periods
  const now = new Date()
  const prev24hStart = new Date(now)
  prev24hStart.setDate(prev24hStart.getDate() - 2)
  const prev24hEnd = new Date(now)
  prev24hEnd.setDate(prev24hEnd.getDate() - 1)
  
  const prev7dStart = new Date(now)
  prev7dStart.setDate(prev7dStart.getDate() - 14)
  const prev7dEnd = new Date(now)
  prev7dEnd.setDate(prev7dEnd.getDate() - 7)
  
  const prev30dStart = new Date(now)
  prev30dStart.setDate(prev30dStart.getDate() - 60)
  const prev30dEnd = new Date(now)
  prev30dEnd.setDate(prev30dEnd.getDate() - 30)
  
  const prevVolume24h = trades
    .filter(t => t.timestamp >= prev24hStart && t.timestamp < prev24hEnd)
    .reduce((sum, t) => sum + t.size * t.entryPrice, 0)
  
  const prevVolume7d = trades
    .filter(t => t.timestamp >= prev7dStart && t.timestamp < prev7dEnd)
    .reduce((sum, t) => sum + t.size * t.entryPrice, 0)
  
  const prevVolume30d = trades
    .filter(t => t.timestamp >= prev30dStart && t.timestamp < prev30dEnd)
    .reduce((sum, t) => sum + t.size * t.entryPrice, 0)
  
  const change24h = prevVolume24h > 0 ? ((volume24h - prevVolume24h) / prevVolume24h) * 100 : 0
  const change7d = prevVolume7d > 0 ? ((volume7d - prevVolume7d) / prevVolume7d) * 100 : 0
  const change30d = prevVolume30d > 0 ? ((volume30d - prevVolume30d) / prevVolume30d) * 100 : 0
  
  return {
    period24h: Math.round(volume24h * 100) / 100,
    period7d: Math.round(volume7d * 100) / 100,
    period30d: Math.round(volume30d * 100) / 100,
    periodAll: Math.round(volumeAll * 100) / 100,
    change24h: Math.round(change24h * 100) / 100,
    change7d: Math.round(change7d * 100) / 100,
    change30d: Math.round(change30d * 100) / 100,
  }
}

// Fee metrics interface
export interface FeeMetrics {
  totalFees: number
  makerFees: number
  takerFees: number
  fundingFees: number
  feeImpact: number
  feeBreakdown: {
    maker: { amount: number; percentage: number }
    taker: { amount: number; percentage: number }
    funding: { amount: number; percentage: number }
  }
}

// Calculate fee metrics
export function getFeeMetrics(trades: Trade[]): FeeMetrics {
  const totalMakerFees = trades.reduce((sum, t) => sum + t.fees.maker, 0)
  const totalTakerFees = trades.reduce((sum, t) => sum + t.fees.taker, 0)
  const totalFundingFees = trades.reduce((sum, t) => sum + t.fees.funding, 0)
  const totalFees = totalMakerFees + totalTakerFees + totalFundingFees
  
  // Calculate gross PnL (before fees)
  const grossPnL = trades.reduce((sum, t) => {
    const notional = t.size * t.entryPrice
    const pnlWithoutFees = t.pnl + (t.fees.maker + t.fees.taker + t.fees.funding)
    return sum + pnlWithoutFees
  }, 0)
  
  const feeImpact = grossPnL !== 0 ? (totalFees / Math.abs(grossPnL)) * 100 : 0
  
  return {
    totalFees: Math.round(totalFees * 100) / 100,
    makerFees: Math.round(totalMakerFees * 100) / 100,
    takerFees: Math.round(totalTakerFees * 100) / 100,
    fundingFees: Math.round(totalFundingFees * 100) / 100,
    feeImpact: Math.round(feeImpact * 100) / 100,
    feeBreakdown: {
      maker: {
        amount: Math.round(totalMakerFees * 100) / 100,
        percentage: totalFees > 0 ? Math.round((totalMakerFees / totalFees) * 10000) / 100 : 0,
      },
      taker: {
        amount: Math.round(totalTakerFees * 100) / 100,
        percentage: totalFees > 0 ? Math.round((totalTakerFees / totalFees) * 10000) / 100 : 0,
      },
      funding: {
        amount: Math.round(totalFundingFees * 100) / 100,
        percentage: totalFees > 0 ? Math.round((totalFundingFees / totalFees) * 10000) / 100 : 0,
      },
    },
  }
}

// Get daily volume data for chart
export function getDailyVolumeData(trades: Trade[], days: number) {
  const data: { date: string; volume: number }[] = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    
    const dayVolume = trades
      .filter(t => t.timestamp >= date && t.timestamp < nextDate)
      .reduce((sum, t) => sum + t.size * t.entryPrice, 0)
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      volume: Math.round(dayVolume * 100) / 100,
    })
  }
  
  return data
}
