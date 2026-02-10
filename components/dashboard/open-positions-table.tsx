"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trade } from "@/lib/mock/trades"
import { X, SlidersHorizontal } from "lucide-react"

// Mock data for open positions with liquidation and margin data
interface Position {
  pair: string
  side: "long" | "short"
  size: string
  entryPrice: number
  currentPrice: number
  liqPrice: number
  marginPercent: number
  pnl: string
  pnlPositive: boolean
  pnlUsd: number
}

const defaultOpenPositions: Position[] = [
  { 
    pair: "BTC/USD", 
    side: "long",
    size: "0.5", 
    entryPrice: 48500, 
    currentPrice: 49200, 
    liqPrice: 45200,
    marginPercent: 12.3,
    pnl: "+12.0%", 
    pnlPositive: true,
    pnlUsd: 350
  },
  { 
    pair: "ETH/USD", 
    side: "short",
    size: "2.0", 
    entryPrice: 3219, 
    currentPrice: 3190, 
    liqPrice: 3350,
    marginPercent: 8.5,
    pnl: "-2.8%", 
    pnlPositive: false,
    pnlUsd: -58
  },
  { 
    pair: "SOL/USD", 
    side: "long",
    size: "50", 
    entryPrice: 98.50, 
    currentPrice: 102.30, 
    liqPrice: 89.20,
    marginPercent: 15.7,
    pnl: "+3.9%", 
    pnlPositive: true,
    pnlUsd: 190
  },
  { 
    pair: "XRP/USD",
    side: "long",
    size: "1000",
    entryPrice: 0.52,
    currentPrice: 0.48,
    liqPrice: 0.465,
    marginPercent: 5.2,
    pnl: "-7.7%", 
    pnlPositive: false,
    pnlUsd: -40
  },
]

interface OpenPositionsTableProps {
  trades?: Trade[]
}

// Calculate liquidation risk based on distance from current price
type LiqRisk = "safe" | "caution" | "danger"

function calculateLiqRisk(currentPrice: number, liqPrice: number, side: "long" | "short"): { risk: LiqRisk; percent: number } {
  const percent = side === "long" 
    ? ((currentPrice - liqPrice) / currentPrice) * 100
    : ((liqPrice - currentPrice) / currentPrice) * 100
  
  if (percent > 10) return { risk: "safe", percent }
  if (percent > 5) return { risk: "caution", percent }
  return { risk: "danger", percent }
}

function getLiqRiskColor(risk: LiqRisk): string {
  switch (risk) {
    case "safe": return "text-emerald-500"
    case "caution": return "text-amber-500"
    case "danger": return "text-rose-500"
  }
}

function getLiqRiskBg(risk: LiqRisk): string {
  switch (risk) {
    case "safe": return "bg-emerald-500/10"
    case "caution": return "bg-amber-500/10"
    case "danger": return "bg-rose-500/10"
  }
}

function getLiqRiskLabel(risk: LiqRisk): string {
  switch (risk) {
    case "safe": return "Safe"
    case "caution": return "Caution"
    case "danger": return "Danger"
  }
}

export function OpenPositionsTable({ trades }: OpenPositionsTableProps) {
  // Use provided trades or fallback to default mock data
  // For open positions, we simulate positions from the trades data
  const positions: Position[] = trades && trades.length > 0
    ? trades.slice(0, 4).map((trade) => {
        const side = trade.side as "long" | "short"
        const currentPrice = trade.exitPrice
        const entryPrice = trade.entryPrice
        // Simulate liquidation price (for longs: lower than entry, for shorts: higher than entry)
        const liqPrice = side === "long" 
          ? entryPrice * 0.85 
          : entryPrice * 1.15
        const marginPercent = Math.random() * 15 + 5 // Random margin between 5-20%
        const pnlUsd = trade.pnl
        
        return {
          pair: `${trade.symbol}/USD`,
          side,
          size: trade.size.toString(),
          entryPrice,
          currentPrice,
          liqPrice,
          marginPercent,
          pnl: `${trade.pnlPercentage >= 0 ? '+' : ''}${trade.pnlPercentage.toFixed(1)}%`,
          pnlPositive: trade.pnlPercentage >= 0,
          pnlUsd,
        }
      })
    : defaultOpenPositions

  const handleClosePosition = (pair: string) => {
    console.log(`Closing position: ${pair}`)
    // Add close position logic here
  }

  const handleAdjustMargin = (pair: string) => {
    console.log(`Adjusting margin for: ${pair}`)
    // Add adjust margin logic here
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pair</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Side</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Entry</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Current</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Liq Price</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Margin %</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">P&L</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {positions.map((position, idx) => {
              const liqRisk = calculateLiqRisk(position.currentPrice, position.liqPrice, position.side)
              
              return (
                <tr 
                  key={idx} 
                  className="relative transition-colors hover:bg-secondary/30"
                >
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{position.pair}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      position.side === "long" 
                        ? "bg-emerald-500/20 text-emerald-500" 
                        : "bg-rose-500/20 text-rose-500"
                    )}>
                      {position.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{position.size}</td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${position.entryPrice.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${position.currentPrice.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-sm font-mono px-2 py-0.5 rounded",
                      getLiqRiskColor(liqRisk.risk),
                      getLiqRiskBg(liqRisk.risk)
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        liqRisk.risk === "safe" && "bg-emerald-500",
                        liqRisk.risk === "caution" && "bg-amber-500",
                        liqRisk.risk === "danger" && "bg-rose-500"
                      )} />
                      ${position.liqPrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{position.marginPercent.toFixed(1)}%</td>
                  <td className={cn(
                    "px-5 py-3 text-right",
                    position.pnlPositive ? "text-emerald-500" : "text-rose-500"
                  )}>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-mono font-medium">{position.pnl}</span>
                      <span className={cn(
                        "text-xs font-mono mt-0.5",
                        position.pnlPositive ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {position.pnlPositive ? '+' : ''}${position.pnlUsd.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClosePosition(position.pair)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <X className="h-3 w-3" />
                        Close
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdjustMargin(position.pair)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <SlidersHorizontal className="h-3 w-3" />
                        Adjust
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
