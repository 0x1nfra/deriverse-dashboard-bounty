import React from "react"
import { cn } from "@/lib/utils"
import { Trade } from "@/lib/mock/trades"

// Mock data for recent trades (fallback when no trades provided)
const defaultRecentTrades = [
  { pair: "BTC/USD", type: "BUY", amount: "0.5", price: "48,500", time: "10m ago" },
  { pair: "ETH/USD", type: "BUY", amount: "0.5", price: "2,450", time: "10m ago" },
  { pair: "XRP/USD", type: "SELL", amount: "1", price: "0.52", time: "10m ago" },
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
  // Use provided trades or fallback to default mock data
  const recentTrades = trades && trades.length > 0
    ? trades.slice(0, 5).map((trade) => ({
        pair: `${trade.symbol}/USD`,
        type: trade.side === "long" ? "BUY" : "SELL",
        amount: trade.size.toString(),
        price: trade.entryPrice.toLocaleString("en-US"),
        time: formatTimeAgo(trade.timestamp),
      }))
    : defaultRecentTrades

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pair</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
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
                <td className="px-5 py-3 text-sm text-muted-foreground text-right">{trade.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
