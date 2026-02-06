"use client"

import { cn } from "@/lib/utils"
import { Trade } from "@/lib/mock/trades"

interface RecentActivityTableProps {
  trades: Trade[]
}

export function RecentActivityTable({ trades }: RecentActivityTableProps) {
  // Get recent trades (sorted by timestamp, most recent first)
  const recentTrades = trades.slice(0, 10)

  // Format time relative
  function formatTimeAgo(timestamp: Date): string {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ago`
    }
    return `${minutes}m ago`
  }

  // Format value
  function formatValue(value: number): string {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`
    }
    return `$${value.toFixed(2)}`
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PnL</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentTrades.map((trade) => (
              <tr key={trade.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold",
                    trade.side === "long" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  )}>
                    {trade.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">
                  {trade.symbol}
                </td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">
                  {trade.size.toFixed(4)}
                </td>
                <td className={cn(
                  "px-5 py-3 text-sm font-mono",
                  trade.pnl >= 0 ? "text-success" : "text-destructive"
                )}>
                  {trade.pnl >= 0 ? "+" : ""}{formatValue(trade.pnl)}
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground text-right">
                  {formatTimeAgo(trade.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
