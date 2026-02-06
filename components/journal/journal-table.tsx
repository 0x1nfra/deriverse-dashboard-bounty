"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AnnotationDisplay } from "@/components/annotations/annotation-display"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { formatCurrency } from "@/lib/mock/trades"

interface JournalTableProps {
  onEditEntry: (id: string) => void
}

export function JournalTable({ onEditEntry }: JournalTableProps) {
  const { filteredTrades } = useFilteredTrades()

  // Sort trades by timestamp (newest first)
  const sortedTrades = [...filteredTrades].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  if (sortedTrades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-8 text-center text-muted-foreground">
          No trades found for the selected filters
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedTrades.slice(0, 10).map((trade) => (
        <div 
          key={trade.id} 
          className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
        >
          {/* Trade Header */}
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                {/* Date */}
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</div>
                  <div className="text-sm text-foreground">
                    {trade.timestamp.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trade.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Asset */}
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Asset</div>
                  <div className="text-sm font-medium text-foreground font-mono">{trade.symbol}</div>
                  <div className="mt-1">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
                        trade.side === "long"
                          ? "bg-success/20 text-success"
                          : "bg-destructive/20 text-destructive"
                      )}
                    >
                      {trade.side === "long" ? "LONG" : "SHORT"}
                    </span>
                  </div>
                </div>

                {/* Entry/Exit */}
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Entry / Exit</div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {formatCurrency(trade.entryPrice)}
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {formatCurrency(trade.exitPrice)}
                  </div>
                </div>

                {/* P&L */}
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">P&L</div>
                  <div className={cn(
                    "text-lg font-mono font-semibold",
                    trade.pnl >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {trade.pnl >= 0 ? "+" : ""}{formatCurrency(trade.pnl)}
                  </div>
                  <div className={cn(
                    "text-xs font-mono",
                    trade.pnlPercentage >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {trade.pnlPercentage >= 0 ? "+" : ""}{trade.pnlPercentage.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="ml-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEditEntry(trade.id)}
                >
                  View
                </Button>
              </div>
            </div>
          </div>

          {/* Annotation Section */}
          <div className="px-5 pb-5">
            <AnnotationDisplay tradeId={trade.id} />
          </div>
        </div>
      ))}

      {/* Show count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {Math.min(sortedTrades.length, 10)} of {sortedTrades.length} trades
      </div>
    </div>
  )
}
