"use client"

import { useState, useMemo } from "react"
import { X, SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useFilters } from "@/hooks/use-filters"
import { usePositionsStore } from "@/stores/positions-store"
import { ClosePositionDialog } from "@/components/dashboard/close-position-dialog"
import { AdjustMarginDialog } from "@/components/dashboard/adjust-margin-dialog"

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

export function OpenPositionsTable() {
  const { filters } = useFilters()
  const storePositions = usePositionsStore((s) => s.positions)
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

  const filteredPositions = useMemo(() => {
    if (filters.tradeType === "long") return storePositions.filter(p => p.side === "long")
    if (filters.tradeType === "short") return storePositions.filter(p => p.side === "short")
    return storePositions
  }, [storePositions, filters.tradeType])

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
              <SortableHeader label="Funding" sortKey="funding" activeKey={sortKey} direction={sortDir} onSort={handleSort} align="right" />
              <SortableHeader label="Liq Price" sortKey="liqPrice" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="Margin" sortKey="margin" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
              <SortableHeader label="PNL" sortKey="pnlUsd" activeKey={sortKey} direction={sortDir} onSort={handleSort} align="right" />
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
                    "px-5 py-3 text-right text-sm font-mono",
                    position.funding >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {position.funding >= 0 ? '+$' : '-$'}{Math.abs(position.funding).toFixed(2)}
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
