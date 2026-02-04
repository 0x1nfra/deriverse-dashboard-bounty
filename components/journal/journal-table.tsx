"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// Mock journal entries
const journalEntries = [
  {
    id: "1",
    date: "2024-01-26",
    asset: "SOL-PERP",
    direction: "LONG",
    entryPrice: 120.50,
    exitPrice: 135.20,
    pnl: 14.70,
    pnlPercent: 12.2,
    isProfit: true,
  },
  {
    id: "2",
    date: "2024-01-25",
    asset: "BTC-PERP",
    direction: "SHORT",
    entryPrice: 34200,
    exitPrice: 33800,
    pnl: 400,
    pnlPercent: 1.17,
    isProfit: true,
  },
  {
    id: "3",
    date: "2024-01-24",
    asset: "ETH-PERP",
    direction: "LONG",
    entryPrice: 1800.00,
    exitPrice: 1750.00,
    pnl: -50.00,
    pnlPercent: -2.78,
    isProfit: false,
  },
  {
    id: "4",
    date: "2024-01-23",
    asset: "ETH-PERP",
    direction: "SHORT",
    entryPrice: 1800.00,
    exitPrice: 1750.00,
    pnl: -50.00,
    pnlPercent: -2.78,
    isProfit: false,
  },
  {
    id: "5",
    date: "2024-01-22",
    asset: "SOL-PERP",
    direction: "SHORT",
    entryPrice: 150.00,
    exitPrice: 162.00,
    pnl: -12.00,
    pnlPercent: -8.0,
    isProfit: false,
  },
]

interface JournalTableProps {
  onEditEntry: (id: string) => void
}

export function JournalTable({ onEditEntry }: JournalTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left">
                <Checkbox />
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Asset
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Direction
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Entry/Exit
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                P&L
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {journalEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3">
                  <Checkbox />
                </td>
                <td className="px-5 py-3 text-sm text-foreground">
                  {entry.date}
                </td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">
                  {entry.asset}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold",
                      entry.direction === "LONG"
                        ? "bg-success text-white"
                        : "bg-destructive text-white"
                    )}
                  >
                    {entry.direction}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">
                  {entry.entryPrice.toLocaleString()} / {entry.exitPrice.toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        entry.isProfit ? "bg-success" : "bg-destructive"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-mono",
                        entry.isProfit ? "text-success" : "text-destructive"
                      )}
                    >
                      {entry.isProfit ? "+" : ""}
                      {entry.pnl.toFixed(2)} ({entry.pnlPercent.toFixed(1)}%)
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEditEntry(entry.id)}
                  >
                    {entry.id === "1" || entry.id === "5" ? "Edit" : "View"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded bg-primary text-primary-foreground text-sm font-medium">
            1
          </span>
          {[2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-secondary text-sm font-medium transition-colors"
            >
              {page}
            </button>
          ))}
          <span className="text-muted-foreground">...</span>
          <button className="h-8 w-8 rounded text-muted-foreground hover:text-foreground hover:bg-secondary text-sm font-medium transition-colors">
            10
          </button>
        </div>
        <span className="text-sm text-muted-foreground">of 47 entries</span>
      </div>
    </div>
  )
}
