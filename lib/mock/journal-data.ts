// Mock journal entries with rich data
// This data structure matches what the JournalEntryModal expects

import { Trade } from "./trades"

export interface JournalEntry {
  // Core Trade Data
  id: string
  tradeId: string
  symbol: string
  side: "long" | "short"
  entryPrice: number
  exitPrice: number
  size: number
  timestamp: Date
  pnl: number
  pnlPercentage: number
  
  // Journal Metadata
  strategy: string
  emotionalState: {
    emoji: string
    label: string
    color: string
  }
  setupDescription: string
  entryRationale: string
  exitRationale: string
  tags: string[]
  screenshots: string[] // Placeholder image URLs
  duration: number // in minutes
}

// Strategies
const strategies = [
  "Breakout",
  "Scalp",
  "Swing",
  "Momentum",
  "Mean Reversion",
  "Trend Following",
  "Support/Resistance",
]

// Emotional states
const emotionalStates = [
  { emoji: "😊", label: "Confident", color: "bg-emerald-500" },
  { emoji: "👍", label: "Good", color: "bg-emerald-500" },
  { emoji: "😐", label: "Neutral", color: "bg-yellow-500" },
  { emoji: "😰", label: "Anxious", color: "bg-orange-500" },
  { emoji: "😤", label: "Frustrated", color: "bg-rose-500" },
  { emoji: "😡", label: "Angry", color: "bg-rose-500" },
]

// Trade tags
const tradeTags = ["Scalp", "Breakout", "Long", "Momentum", "Swing", "Day Trade", "Support", "Resistance"]

// Setup templates
const setupTemplates = [
  "Price broke above key resistance level with strong volume on the 4H chart. RSI showed bullish divergence, and MACD crossed above signal line.",
  "Double bottom pattern formed at major support. Volume profile showed accumulation zone. Waited for confirmation candle close above neckline.",
  "Falling wedge pattern breaking out. Decreasing volume during consolidation indicated sellers exhaustion. Entered on breakout with stop below wedge support.",
  "Pullback to 20 EMA after strong uptrend. Price bounced with hammer candlestick. Volume spike confirmed buyer interest at this level.",
  "Head and shoulders pattern forming. Shorted the right shoulder as it approached neckline. Volume declining on each peak confirmed weakness.",
  "Range breakout after 3-day consolidation. Price squeezed between Bollinger Bands. Entered on close above upper band with momentum.",
]

const entryRationaleTemplates = [
  "Strong momentum after consolidation period. Volume increased 3x average, indicating institutional interest.",
  "Technical setup aligned perfectly - price at support, RSI oversold bounce, and bullish engulfing candle.",
  "News catalyst drove initial move, waited for pullback to enter with better risk/reward ratio.",
  "Algorithmic signals triggered buy. Backtested this setup has 65% win rate in current market conditions.",
  "FOMO entry after seeing continued strength. Should have waited for better entry but didn't want to miss move.",
]

const exitRationaleTemplates = [
  "Hit predetermined profit target at resistance level. Took partial profits and moved stop to breakeven.",
  "Price action weakened - lower highs on decreasing volume. Exited before full reversal.",
  "Stop loss hit. Setup invalidated when price broke below key support with high volume.",
  "Trailing stop triggered after parabolic move. Secured profits as momentum slowed.",
  "Manual exit due to upcoming high-impact news event. Didn't want overnight risk.",
]

// Generate random number in range
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Generate random integer in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Sample trades data (subset for journal entries)
const sampleTrades: Partial<Trade>[] = [
  {
    id: "trade-0001",
    symbol: "SOL",
    side: "long",
    entryPrice: 98.5,
    exitPrice: 102.3,
    size: 100,
    pnl: 375.0,
    pnlPercentage: 3.86,
    timestamp: new Date("2025-01-15T14:30:00"),
    duration: 180,
  },
  {
    id: "trade-0002",
    symbol: "BTC",
    side: "long",
    entryPrice: 43250,
    exitPrice: 44500,
    size: 0.5,
    pnl: 625.0,
    pnlPercentage: 2.89,
    timestamp: new Date("2025-01-14T09:15:00"),
    duration: 240,
  },
  {
    id: "trade-0003",
    symbol: "ETH",
    side: "short",
    entryPrice: 2580,
    exitPrice: 2510,
    size: 10,
    pnl: 700.0,
    pnlPercentage: 2.71,
    timestamp: new Date("2025-01-13T16:45:00"),
    duration: 120,
  },
  {
    id: "trade-0004",
    symbol: "BONK",
    side: "long",
    entryPrice: 0.0000235,
    exitPrice: 0.0000218,
    size: 5000000,
    pnl: -85.0,
    pnlPercentage: -7.23,
    timestamp: new Date("2025-01-12T11:20:00"),
    duration: 360,
  },
  {
    id: "trade-0005",
    symbol: "JUP",
    side: "long",
    entryPrice: 1.15,
    exitPrice: 1.28,
    size: 2000,
    pnl: 260.0,
    pnlPercentage: 11.3,
    timestamp: new Date("2025-01-11T13:00:00"),
    duration: 480,
  },
  {
    id: "trade-0006",
    symbol: "WIF",
    side: "short",
    entryPrice: 0.38,
    exitPrice: 0.35,
    size: 5000,
    pnl: 150.0,
    pnlPercentage: 7.89,
    timestamp: new Date("2025-01-10T15:30:00"),
    duration: 90,
  },
  {
    id: "trade-0007",
    symbol: "PEPE",
    side: "long",
    entryPrice: 0.0000142,
    exitPrice: 0.0000148,
    size: 10000000,
    pnl: 60.0,
    pnlPercentage: 4.23,
    timestamp: new Date("2025-01-09T10:45:00"),
    duration: 150,
  },
  {
    id: "trade-0008",
    symbol: "DOGE",
    side: "long",
    entryPrice: 0.148,
    exitPrice: 0.142,
    size: 15000,
    pnl: -90.0,
    pnlPercentage: -4.05,
    timestamp: new Date("2025-01-08T14:20:00"),
    duration: 300,
  },
]

// Generate journal entries from trades
export function generateMockJournalEntries(): JournalEntry[] {
  return sampleTrades.map((trade, index) => {
    const isWin = (trade.pnl || 0) >= 0
    
    // Select emotion based on P&L
    const emotionIndex = isWin 
      ? randomInt(0, 2) // Positive emotions for wins
      : randomInt(2, 5) // Negative emotions for losses
    
    // Select 2-3 random tags
    const numTags = randomInt(2, 3)
    const shuffledTags = [...tradeTags].sort(() => Math.random() - 0.5)
    const selectedTags = shuffledTags.slice(0, numTags)
    
    // Select screenshot placeholders (2-4 images)
    const numScreenshots = randomInt(2, 4)
    const screenshots = Array.from({ length: numScreenshots }, (_, i) => 
      `https://placehold.co/400x300/1a1a1a/666?text=Chart+${i + 1}`
    )
    
    return {
      id: `journal-${index + 1}`,
      tradeId: trade.id || `trade-${index + 1}`,
      symbol: trade.symbol || "SOL",
      side: trade.side || "long",
      entryPrice: trade.entryPrice || 0,
      exitPrice: trade.exitPrice || 0,
      size: trade.size || 0,
      timestamp: trade.timestamp || new Date(),
      pnl: trade.pnl || 0,
      pnlPercentage: trade.pnlPercentage || 0,
      duration: trade.duration || 0,
      
      strategy: strategies[randomInt(0, strategies.length - 1)],
      emotionalState: emotionalStates[emotionIndex],
      setupDescription: setupTemplates[randomInt(0, setupTemplates.length - 1)],
      entryRationale: entryRationaleTemplates[randomInt(0, entryRationaleTemplates.length - 1)],
      exitRationale: exitRationaleTemplates[randomInt(0, exitRationaleTemplates.length - 1)],
      tags: selectedTags,
      screenshots,
    }
  })
}

// Export mock data
export const mockJournalEntries = generateMockJournalEntries()

// Helper function to get a single journal entry by trade ID
export function getJournalEntryByTradeId(tradeId: string): JournalEntry | undefined {
  return mockJournalEntries.find(entry => entry.tradeId === tradeId)
}

// Helper function to format duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}
