"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { OpenPositionsTable } from "@/components/dashboard/open-positions-table"
import { useFilters } from "@/hooks/use-filters"

// Secondary tabs for positions section
const positionTabs = ["Open Positions", "Closed Positions", "Open Orders"]

// Module-level data constants for stable references
const allClosedPositions = [
  { pair: "BTC/USD", side: "long" as const, size: "0.3", entryPrice: "45,200", exitPrice: "47,800", pnl: "+5.75%", pnlPositive: true, closedAt: "2024-01-25" },
  { pair: "ETH/USD", side: "short" as const, size: "5.0", entryPrice: "2,100", exitPrice: "2,050", pnl: "-2.38%", pnlPositive: false, closedAt: "2024-01-24" },
  { pair: "SOL/USD", side: "long" as const, size: "100", entryPrice: "85.00", exitPrice: "98.50", pnl: "+15.88%", pnlPositive: true, closedAt: "2024-01-23" },
]

const allOpenOrders = [
  { pair: "BTC/USD", side: "long" as const, type: "Limit Buy", price: "42,000", size: "0.2", status: "Pending" },
  { pair: "ETH/USD", side: "short" as const, type: "Stop Loss", price: "2,200", size: "3.0", status: "Active" },
  { pair: "SOL/USD", side: "long" as const, type: "Take Profit", price: "120.00", size: "25", status: "Active" },
]

export function PositionsTabContent() {
  const [activePositionTab, setActivePositionTab] = useState("Open Positions")

  return (
    <div className="space-y-6">
      {/* Positions Header */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-foreground">Positions</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your open and closed positions</p>
      </div>

      {/* Secondary Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-border">
        {positionTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePositionTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activePositionTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activePositionTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Positions Content */}
      {activePositionTab === "Open Positions" && <OpenPositionsTable />}
      {activePositionTab === "Closed Positions" && <ClosedPositionsTable />}
      {activePositionTab === "Open Orders" && <OpenOrdersTable />}
    </div>
  )
}

// Closed Positions Table Component
function ClosedPositionsTable() {
  const { filters } = useFilters()

  const closedPositions = useMemo(() => {
    if (filters.tradeType === "long") return allClosedPositions.filter(p => p.side === "long")
    if (filters.tradeType === "short") return allClosedPositions.filter(p => p.side === "short")
    return allClosedPositions
  }, [filters.tradeType])

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
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Exit</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Closed</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {closedPositions.map((position, idx) => (
              <tr key={idx} className="hover:bg-secondary/30 transition-colors">
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
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${position.entryPrice}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${position.exitPrice}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{position.closedAt}</td>
                <td className={cn(
                  "px-5 py-3 text-sm font-mono text-right",
                  position.pnlPositive ? "text-success" : "text-destructive"
                )}>
                  {position.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Open Orders Table Component
function OpenOrdersTable() {
  const { filters } = useFilters()

  const openOrders = useMemo(() => {
    if (filters.tradeType === "long") return allOpenOrders.filter(o => o.side === "long")
    if (filters.tradeType === "short") return allOpenOrders.filter(o => o.side === "short")
    return allOpenOrders
  }, [filters.tradeType])

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pair</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Side</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {openOrders.map((order, idx) => (
              <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-foreground">{order.pair}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                    order.side === "long"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-rose-500/20 text-rose-500"
                  )}>
                    {order.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{order.type}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${order.price}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{order.size}</td>
                <td className="px-5 py-3 text-right">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold",
                    order.status === "Active" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                  )}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
