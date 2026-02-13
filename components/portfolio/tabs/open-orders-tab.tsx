"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { useFilters } from "@/hooks/use-filters"
import { NoTradesState, NoFilterResultsState } from "@/components/empty-states"

interface OpenOrder {
  pair: string
  side: "long" | "short"
  type: string
  triggerPrice: number
  size: string
  currentPrice: number
  status: string
  time: string
}

const defaultOpenOrders: OpenOrder[] = [
  {
    pair: "BTC/USD",
    side: "long",
    type: "Limit Buy",
    triggerPrice: 42000,
    size: "0.2",
    currentPrice: 49200,
    status: "Pending",
    time: "2m ago",
  },
  {
    pair: "ETH/USD",
    side: "short",
    type: "Stop Loss",
    triggerPrice: 2200,
    size: "3.0",
    currentPrice: 3190,
    status: "Active",
    time: "15m ago",
  },
  {
    pair: "SOL/USD",
    side: "long",
    type: "Take Profit",
    triggerPrice: 120.00,
    size: "25",
    currentPrice: 162.80,
    status: "Active",
    time: "1h ago",
  },
]

function calculateDistance(triggerPrice: number, currentPrice: number): { percent: number; label: string } {
  const percent = ((triggerPrice - currentPrice) / currentPrice) * 100
  const isBelow = percent < 0

  return {
    percent: Math.abs(percent),
    label: isBelow ? `${percent.toFixed(1)}%` : `+${percent.toFixed(1)}%`
  }
}

function getDistanceColor(percent: number): string {
  if (percent < 2) return "text-rose-500"
  if (percent < 5) return "text-amber-500"
  return "text-emerald-500"
}

export function OpenOrdersTabContent() {
  const { filteredTrades, isLoading } = useFilteredTrades()
  const { resetFilters, isDefault } = useFilters()
  const [isClient, setIsClient] = useState(false)
  const [orders, setOrders] = useState<OpenOrder[]>(defaultOpenOrders)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleCancelOrder = (index: number) => {
    console.log(`Canceling order at index: ${index}`)
    setOrders(prev => prev.filter((_, i) => i !== index))
  }

  // Handle empty states
  if (!isLoading && isClient && filteredTrades.length === 0) {
    if (isDefault) {
      return (
        <div className="space-y-6">
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-foreground">Open Orders</h2>
            <p className="text-muted-foreground text-sm mt-1">Manage your pending and active orders</p>
          </div>
          <NoTradesState />
        </div>
      )
    }
    return (
      <div className="space-y-6">
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-foreground">Open Orders</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your pending and active orders</p>
        </div>
        <NoFilterResultsState onClearFilters={resetFilters} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Open Orders Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pair</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Side</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trigger Price</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order Value</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Current</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Distance</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order, idx) => {
                const distance = calculateDistance(order.triggerPrice, order.currentPrice)
                const orderValue = parseFloat(order.size) * order.triggerPrice

                return (
                  <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-foreground">{order.pair}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                        order.side === "long"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-rose-500/20 text-rose-500"
                      )}>
                        {order.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{order.type}</td>
                    <td className="px-5 py-4 text-sm font-mono text-foreground">{order.size}</td>
                    <td className="px-5 py-4 text-sm font-mono text-foreground">${order.triggerPrice.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-mono text-foreground">${orderValue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-mono text-foreground">${order.currentPrice.toLocaleString()}</td>
                    <td className={cn(
                      "px-5 py-4 text-sm font-mono text-right font-medium",
                      getDistanceColor(distance.percent)
                    )}>
                      {distance.label}
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground text-right">{order.time}</td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(idx)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
