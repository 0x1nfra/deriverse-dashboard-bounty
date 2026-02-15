"use client"

import React, { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronUp, ChevronDown } from "lucide-react"
import { Trade } from "@/lib/mock/trades"
import { JournalEntryModal } from "@/components/journal/journal-entry-modal"

interface DisplayTrade {
  pair: string
  side: "long" | "short"
  size: string
  sizeNum: number
  positionValue: number
  entryPrice: string
  entryPriceNum: number
  exitPrice: string
  exitPriceNum: number
  pnl: number
  pnlPercentage: number
  pnlUsd: number
  time: string
  timestamp: number
  symbol: string
}

// Mock data for recent trades (fallback when no trades provided)
const defaultRecentTrades: DisplayTrade[] = [
  { pair: "BTC/USD", side: "long", size: "0.5", sizeNum: 0.5, positionValue: 24600, entryPrice: "48,500", entryPriceNum: 48500, exitPrice: "49,200", exitPriceNum: 49200, pnl: 350, pnlPercentage: 1.44, pnlUsd: 350, time: "10m ago", timestamp: Date.now() - 600000, symbol: "BTC" },
  { pair: "ETH/USD", side: "long", size: "0.5", sizeNum: 0.5, positionValue: 1260, entryPrice: "2,450", entryPriceNum: 2450, exitPrice: "2,520", exitPriceNum: 2520, pnl: 35, pnlPercentage: 2.86, pnlUsd: 35, time: "10m ago", timestamp: Date.now() - 600000, symbol: "ETH" },
  { pair: "XRP/USD", side: "short", size: "1", sizeNum: 1, positionValue: 0.48, entryPrice: "0.52", entryPriceNum: 0.52, exitPrice: "0.48", exitPriceNum: 0.48, pnl: 0.04, pnlPercentage: 7.69, pnlUsd: 0.04, time: "10m ago", timestamp: Date.now() - 600000, symbol: "XRP" },
]

interface RecentTradesTableProps {
  trades?: Trade[]
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

type SortKey = "pair" | "side" | "size" | "positionValue" | "entryPrice" | "exitPrice" | "pnlUsd" | "time"
type SortDir = "asc" | "desc"

function getSortValue(trade: DisplayTrade, key: SortKey): number | string {
  switch (key) {
    case "pair": return trade.pair
    case "side": return trade.side
    case "size": return trade.sizeNum
    case "positionValue": return trade.positionValue
    case "entryPrice": return trade.entryPriceNum
    case "exitPrice": return trade.exitPriceNum
    case "pnlUsd": return trade.pnlUsd
    case "time": return trade.timestamp
  }
}

interface SortableHeaderProps {
  label: string
  sortKey: SortKey
  activeKey: SortKey | null
  direction: SortDir
  onSort: (key: SortKey) => void
  align?: "left" | "right"
  className?: string
}

function SortableHeader({ label, sortKey, activeKey, direction, onSort, align = "left", className }: SortableHeaderProps) {
  const isActive = activeKey === sortKey

  return (
    <th
      className={cn(
        "px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none group/th",
        align === "right" ? "text-right" : "text-left",
        className
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

export function RecentTradesTable({ trades }: RecentTradesTableProps): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState<{
    pair: string
    side: "long" | "short"
    size: string
    entryPrice: string
    symbol: string
    pnl: number
    pnlPercentage: number
  } | null>(null)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  // Use provided trades or fallback to default mock data
  const recentTrades: DisplayTrade[] = useMemo(() => {
    if (trades && trades.length > 0) {
      return trades.slice(0, 5).map((trade) => {
        return {
          pair: `${trade.symbol}/USD`,
          side: trade.side,
          size: trade.size.toString(),
          sizeNum: trade.size,
          positionValue: trade.size * trade.exitPrice,
          entryPrice: trade.entryPrice.toLocaleString("en-US"),
          entryPriceNum: trade.entryPrice,
          exitPrice: trade.exitPrice.toLocaleString("en-US"),
          exitPriceNum: trade.exitPrice,
          pnl: trade.pnl,
          pnlPercentage: trade.pnlPercentage,
          pnlUsd: trade.pnl,
          time: formatTimeAgo(trade.timestamp),
          timestamp: trade.timestamp.getTime(),
          symbol: trade.symbol,
        }
      })
    }
    return defaultRecentTrades
  }, [trades])

  const sortedTrades = useMemo(() => {
    if (!sortKey) return recentTrades
    return [...recentTrades].sort((a, b) => {
      const aVal = getSortValue(a, sortKey)
      const bVal = getSortValue(b, sortKey)
      const cmp = typeof aVal === "string" && typeof bVal === "string"
        ? aVal.localeCompare(bVal)
        : (aVal as number) - (bVal as number)
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [recentTrades, sortKey, sortDir])

  const handleJournalClick = (trade: DisplayTrade) => {
    setSelectedTrade(trade)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTrade(null)
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
                <SortableHeader label="Exit" sortKey="exitPrice" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="PNL" sortKey="pnlUsd" activeKey={sortKey} direction={sortDir} onSort={handleSort} align="right" />
                <SortableHeader label="Time" sortKey="time" activeKey={sortKey} direction={sortDir} onSort={handleSort} align="right" className="whitespace-nowrap" />
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedTrades.map((trade, idx) => (
                <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{trade.pair}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      trade.side === "long"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-rose-500/20 text-rose-500"
                    )}>
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">{trade.size}</td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">${trade.positionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">${trade.entryPrice}</td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">${trade.exitPrice}</td>
                  <td className={cn(
                    "px-5 py-3 text-right",
                    trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-mono font-medium">{trade.pnl >= 0 ? '+' : ''}{trade.pnlPercentage.toFixed(1)}%</span>
                      <span className={cn(
                        "text-xs font-mono mt-0.5",
                        trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnlUsd.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground text-right whitespace-nowrap">{trade.time}</td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJournalClick(trade)}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <BookOpen className="h-3 w-3" />
                      Journal
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Journal Entry Modal */}
      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingEntryId={null}
      />
    </>
  )
}
