// Client-only mock trade data hook
// Generates trades only on the client to avoid SSR hydration mismatches

import { useState, useEffect, useMemo } from "react"

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

// Generate random number in range
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Generate random integer in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate random date within last 90 days
function randomDate(): Date {
  const now = new Date()
  const daysAgo = randomInt(0, 90)
  const hoursAgo = randomInt(0, 23)
  const minutesAgo = randomInt(0, 59)
  
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  date.setHours(date.getHours() - hoursAgo)
  date.setMinutes(date.getMinutes() - minutesAgo)
  
  return date
}

// Generate realistic trade data
function generateTrade(id: number): Trade {
  const symbol = symbols[randomInt(0, symbols.length - 1)]
  const side: "long" | "short" = Math.random() > 0.5 ? "long" : "short"
  const orderType: "market" | "limit" | "stop" = 
    Math.random() > 0.7 ? "market" : Math.random() > 0.5 ? "limit" : "stop"
  
  // Base prices for different symbols
  const basePrices: Record<string, number> = {
    SOL: 100,
    ETH: 2500,
    BTC: 50000,
    BONK: 0.00002,
    JUP: 0.8,
    WIF: 0.25,
    PEPE: 0.000001,
    DOGE: 0.08,
  }
  
  const basePrice = basePrices[symbol]
  const priceVolatility = 0.1 // 10% price movement
  const entryPrice = basePrice * (1 + randomInRange(-priceVolatility, priceVolatility))
  
  // 60% win rate
  const isWin = Math.random() < 0.6
  const pnlDirection = isWin ? 1 : -1
  const pnlPercentage = randomInRange(0.5, 15) * pnlDirection
  const exitPrice = entryPrice * (1 + pnlPercentage / 100)
  
  // Position size varies by symbol value
  const sizeMultiplier = symbol === "BTC" ? 0.1 : symbol === "ETH" ? 1 : symbol === "SOL" ? 50 : 100000
  const size = randomInRange(0.5, 5) * sizeMultiplier
  
  // Calculate notional value
  const notionalValue = size * entryPrice
  
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
    timestamp: randomDate(),
    duration: Math.round(holdTimeHours * 60),
  }
}

// Generate trades array
function generateTrades(count: number): Trade[] {
  const trades = Array.from({ length: count }, (_, i) => generateTrade(i + 1))
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
