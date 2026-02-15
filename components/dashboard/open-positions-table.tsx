"use client"

import { useState, useMemo } from "react"
import { X, SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trade } from "@/lib/mock/trades"
import { useFilters } from "@/hooks/use-filters"
import { ClosePositionDialog } from "@/components/dashboard/close-position-dialog"
import { AdjustMarginDialog } from "@/components/dashboard/adjust-margin-dialog"

// Deterministic margin percent generator (5-20%) based on trade data
function getDeterministicMarginPercent(trade: Trade): number {
  // Use trade properties to generate a deterministic value between 5-20%
  const hash = trade.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const sizeHash = trade.size.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const combined = (hash + sizeHash) % 1000
  return 5 + (combined / 1000) * 15 // Range: 5-20%
}

// Mock data for open positions with liquidation and margin data
export interface Position {
  pair: string
  side: "long" | "short"
  size: string
  positionValue: number
  entryPrice: number
  currentPrice: number
  liqPrice: number
  marginPercent: number
  pnl: string
  pnlPositive: boolean
  pnlUsd: number
  funding: number
}

const defaultOpenPositions: Position[] = [
  {
    pair: "BTC/USD",
    side: "long",
    size: "0.5",
    positionValue: 0.5 * 49200,
    entryPrice: 48500,
    currentPrice: 49200,
    liqPrice: 45200,
    marginPercent: 12.3,
    pnl: "+12.0%",
    pnlPositive: true,
    pnlUsd: 350,
    funding: -12.50
  },
  {
    pair: "ETH/USD",
    side: "short",
    size: "2.0",
    positionValue: 2.0 * 3190,
    entryPrice: 3219,
    currentPrice: 3190,
    liqPrice: 3350,
    marginPercent: 8.5,
    pnl: "-2.8%",
    pnlPositive: false,
    pnlUsd: -58,
    funding: 8.30
  },
  {
    pair: "SOL/USD",
    side: "long",
    size: "50",
    positionValue: 50 * 102.30,
    entryPrice: 98.50,
    currentPrice: 102.30,
    liqPrice: 89.20,
    marginPercent: 15.7,
    pnl: "+3.9%",
    pnlPositive: true,
    pnlUsd: 190,
    funding: -5.20
  },
  {
    pair: "XRP/USD",
    side: "long",
    size: "1000",
    positionValue: 1000 * 0.48,
    entryPrice: 0.52,
    currentPrice: 0.48,
    liqPrice: 0.465,
    marginPercent: 5.2,
    pnl: "-7.7%",
    pnlPositive: false,
    pnlUsd: -40,
    funding: -1.80
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

type SortKey = "pair" | "side" | "size" | "positionValue" | "entryPrice" | "currentPrice" | "pnlUsd" | "liqPrice" | "margin" | "funding"
type SortDir = "asc" | "desc"

function getSortValue(position: Position, key: SortKey): number | string {
  switch (key) {
    case "pair": return position.pair
    case "side": return position.side
    case "size": return parseFloat(position.size)
    case "positionValue": return position.positionValue
    case "entryPrice": return position.entryPrice
    case "currentPrice": return position.currentPrice
    case "pnlUsd": return position.pnlUsd
    case "liqPrice": return position.liqPrice
    case "margin": return position.positionValue * position.marginPercent / 100
    case "funding": return position.funding
  }
}

interface SortableHeaderProps {
  label: string
  sortKey: SortKey
  activeKey: SortKey | null
  direction: SortDir
  onSort: (key: SortKey) => void
  align?: "left" | "right"
}

function SortableHeader({ label, sortKey, activeKey, direction, onSort, align = "left" }: SortableHeaderProps) {
  const isActive = activeKey === sortKey

  return (
    <th
      className={cn(
        "px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none group/th",
        align === "right" ? "text-right" : "text-left"
      )}
      onClick={() => onSort(sortKey)}
    >
      <span className={cn(
        "inline-flex items-center gap-1",
        align === "right" && "flex-row-reverse"
      )}>
        {label}
        <span className={cn(
          "inline-flex flex-col -space-y-1",
          isActive ? "opacity-100" : "opacity-0 group-hover/th:opacity-40 transition-opacity"
        )}>
          {isActive ? (
            direction === "asc"
              ? <ChevronUp className="h-3.5 w-3.5" />
              : <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </span>
      </span>
    </th>
  )
}

export function OpenPositionsTable({ trades }: OpenPositionsTableProps) {
  const { filters } = useFilters()
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [closingPosition, setClosingPosition] = useState<Position | null>(null)
  const [adjustingPosition, setAdjustingPosition] = useState<Position | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  // Use provided trades or fallback to default mock data
  // For open positions, we simulate positions from the trades data
  const rawPositions = useMemo<Position[]>(() => {
    if (trades && trades.length > 0) {
      return trades.slice(0, 4).map((trade) => {
        const side = trade.side as "long" | "short"
        const currentPrice = trade.exitPrice
        const entryPrice = trade.entryPrice
        // Simulate liquidation price (for longs: lower than entry, for shorts: higher than entry)
        const liqPrice = side === "long"
          ? entryPrice * 0.85
          : entryPrice * 1.15
        const marginPercent = getDeterministicMarginPercent(trade) // Deterministic margin between 5-20%
        const pnlUsd = trade.pnl
        const positionValue = trade.size * currentPrice

        return {
          pair: `${trade.symbol}/USD`,
          side,
          size: trade.size.toString(),
          positionValue,
          entryPrice,
          currentPrice,
          liqPrice,
          marginPercent,
          pnl: `${trade.pnlPercentage >= 0 ? '+' : ''}${trade.pnlPercentage.toFixed(1)}%`,
          pnlPositive: trade.pnlPercentage >= 0,
          pnlUsd,
          funding: trade.fees.funding,
        }
      })
    }
    return defaultOpenPositions
  }, [trades])

  const filteredPositions = useMemo(() => {
    if (filters.tradeType === "long") return rawPositions.filter(p => p.side === "long")
    if (filters.tradeType === "short") return rawPositions.filter(p => p.side === "short")
    return rawPositions
  }, [rawPositions, filters.tradeType])

  const positions = useMemo(() => {
    if (!sortKey) return filteredPositions
    return [...filteredPositions].sort((a, b) => {
      const aVal = getSortValue(a, sortKey)
      const bVal = getSortValue(b, sortKey)
      const cmp = typeof aVal === "string" && typeof bVal === "string"
        ? aVal.localeCompare(bVal)
        : (aVal as number) - (bVal as number)
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filteredPositions, sortKey, sortDir])

  const handleClosePosition = (position: Position) => {
    setClosingPosition(position)
  }

  const handleAdjustMargin = (position: Position) => {
    setAdjustingPosition(position)
  }

  return (
    <>
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <SortableHeader label="Pair" sortKey="pair" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="Side" sortKey="side" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="Size" sortKey="size" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="Position Value" sortKey="positionValue" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="Entry" sortKey="entryPrice" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="Mark Price" sortKey="currentPrice" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="PNL" sortKey="pnlUsd" activeKey={sortKey} direction={sortDir} onSort={handleSort} align="right" />
              <SortableHeader label="Liq Price" sortKey="liqPrice" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="Margin" sortKey="margin" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="Funding" sortKey="funding" activeKey={sortKey} direction={sortDir} onSort={handleSort} align="right" />
              <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
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
                  <td className="px-5 py-3 text-sm font-mono text-foreground">{position.size}</td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">${position.positionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">${position.entryPrice.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">${position.currentPrice.toLocaleString()}</td>
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
                        {position.pnlPositive ? '+$' : '-$'}{Math.abs(position.pnlUsd).toLocaleString()}
                      </span>
                    </div>
                  </td>
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
                  <td className="px-5 py-3 text-sm font-mono text-foreground">${(position.positionValue * position.marginPercent / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className={cn(
                    "px-5 py-3 text-right text-sm font-mono",
                    position.funding >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {position.funding >= 0 ? '+$' : '-$'}{Math.abs(position.funding).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdjustMargin(position)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <SlidersHorizontal className="h-3 w-3" />
                        Adjust
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClosePosition(position)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <X className="h-3 w-3" />
                        Close
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

      {closingPosition && (
        <ClosePositionDialog
          open={!!closingPosition}
          onOpenChange={(open) => { if (!open) setClosingPosition(null) }}
          position={closingPosition}
        />
      )}

      {adjustingPosition && (
        <AdjustMarginDialog
          open={!!adjustingPosition}
          onOpenChange={(open) => { if (!open) setAdjustingPosition(null) }}
          position={adjustingPosition}
        />
      )}
    </>
  )
}
