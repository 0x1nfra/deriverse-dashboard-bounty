"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { Trade } from "@/lib/mock/trades"
import { JournalEntryModal } from "@/components/journal/journal-entry-modal"

// Mock data for recent trades (fallback when no trades provided)
const defaultRecentTrades = [
  { pair: "BTC/USD", type: "BUY", amount: "0.5", price: "48,500", time: "10m ago", symbol: "BTC" },
  { pair: "ETH/USD", type: "BUY", amount: "0.5", price: "2,450", time: "10m ago", symbol: "ETH" },
  { pair: "XRP/USD", type: "SELL", amount: "1", price: "0.52", time: "10m ago", symbol: "XRP" },
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

export function RecentTradesTable({ trades }: RecentTradesTableProps): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState<{
    pair: string
    type: string
    amount: string
    price: string
    symbol: string
    pnl: number
    pnlPercentage: number
  } | null>(null)

  // Use provided trades or fallback to default mock data
  const recentTrades = trades && trades.length > 0
    ? trades.slice(0, 5).map((trade) => ({
        pair: `${trade.symbol}/USD`,
        type: trade.side === "long" ? "BUY" : "SELL",
        amount: trade.size.toString(),
        price: trade.entryPrice.toLocaleString("en-US"),
        time: formatTimeAgo(trade.timestamp),
        symbol: trade.symbol,
        pnl: trade.pnl,
        pnlPercentage: trade.pnlPercentage,
      }))
    : defaultRecentTrades.map((trade) => ({
        ...trade,
        pnl: 0,
        pnlPercentage: 0,
      }))

  const handleJournalClick = (trade: typeof recentTrades[0]) => {
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
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pair</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">P&L</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTrades.map((trade, idx) => (
                <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{trade.pair}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      trade.type === "BUY" 
                        ? "bg-success/20 text-success" 
                        : "bg-destructive/20 text-destructive"
                    )}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{trade.amount}</td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${trade.price}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-sm font-mono font-semibold",
                        trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
                      </span>
                      <span className={cn(
                        "text-xs font-mono",
                        trade.pnl >= 0 ? "text-emerald-500/80" : "text-rose-500/80"
                      )}>
                        ({trade.pnl >= 0 ? '+' : ''}{trade.pnlPercentage.toFixed(1)}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground text-right">{trade.time}</td>
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
