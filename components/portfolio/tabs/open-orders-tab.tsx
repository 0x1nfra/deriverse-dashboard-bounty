"use client"

import { useEffect, useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X, ChevronUp, ChevronDown } from "lucide-react"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { useFilters } from "@/hooks/use-filters"
import { NoTradesState, NoFilterResultsState } from "@/components/empty-states"

interface OpenOrder {
  pair: string
  type: string
  side: "long" | "short"
  size: string
  price: number
  currentPrice: number
  reduceOnly: boolean
  triggerCondition: string | null
  tp: number | null
  sl: number | null
  time: string
}

const defaultOpenOrders: OpenOrder[] = [
  {
    pair: "BTC/USD",
    type: "Limit",
    side: "long",
    size: "0.2",
    price: 42000,
    currentPrice: 49200,
    reduceOnly: false,
    triggerCondition: null,
    tp: 55000,
    sl: 39000,
    time: "2m ago",
  },
  {
    pair: "ETH/USD",
    type: "Stop Market",
    side: "short",
    size: "3.0",
    price: 2200,
    currentPrice: 3190,
    reduceOnly: true,
    triggerCondition: "Mark ≤ $2,200",
    tp: null,
    sl: null,
    time: "15m ago",
  },
  {
    pair: "SOL/USD",
    type: "Take Profit",
    side: "long",
    size: "25",
    price: 120.00,
    currentPrice: 162.80,
    reduceOnly: true,
    triggerCondition: "Mark ≥ $120.00",
    tp: 180,
    sl: 95,
    time: "1h ago",
  },
]

type SortKey = "pair" | "type" | "side" | "size" | "orderValue" | "price" | "currentPrice" | "reduceOnly" | "triggerCondition" | "tp" | "time"
type SortDir = "asc" | "desc"

function getSortValue(order: OpenOrder, key: SortKey): number | string {
  switch (key) {
    case "pair": return order.pair
    case "type": return order.type
    case "side": return order.side
    case "size": return parseFloat(order.size)
    case "orderValue": return parseFloat(order.size) * order.price
    case "price": return order.price
    case "currentPrice": return order.currentPrice
    case "reduceOnly": return order.reduceOnly ? 1 : 0
    case "triggerCondition": return order.triggerCondition ?? ""
    case "tp": return order.tp ?? 0
    case "time": return order.time
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

export function OpenOrdersTabContent() {
  const { filteredTrades, isLoading } = useFilteredTrades()
  const { resetFilters, isDefault, filters } = useFilters()
  const [isClient, setIsClient] = useState(false)
  const [orders, setOrders] = useState<OpenOrder[]>(defaultOpenOrders)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const visibleOrders = useMemo(() => {
    if (filters.tradeType === "long") return orders.filter(o => o.side === "long")
    if (filters.tradeType === "short") return orders.filter(o => o.side === "short")
    return orders
  }, [orders, filters.tradeType])

  const sortedOrders = useMemo(() => {
    if (!sortKey) return visibleOrders
    return [...visibleOrders].sort((a, b) => {
      const aVal = getSortValue(a, sortKey)
      const bVal = getSortValue(b, sortKey)
      const cmp = typeof aVal === "string" && typeof bVal === "string"
        ? aVal.localeCompare(bVal)
        : (aVal as number) - (bVal as number)
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [visibleOrders, sortKey, sortDir])

  const handleCancelOrder = (index: number) => {
    const orderToCancel = sortedOrders[index]
    setOrders(prev => prev.filter(o => o !== orderToCancel))
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
                <SortableHeader label="Pair" sortKey="pair" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Type" sortKey="type" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Side" sortKey="side" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Size" sortKey="size" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Order Value" sortKey="orderValue" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Price" sortKey="price" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Current Price" sortKey="currentPrice" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Reduce Only" sortKey="reduceOnly" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Trigger Condition" sortKey="triggerCondition" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="TP/SL" sortKey="tp" activeKey={sortKey} direction={sortDir} onSort={handleSort} />
                <SortableHeader label="Time" sortKey="time" activeKey={sortKey} direction={sortDir} onSort={handleSort} align="right" className="whitespace-nowrap" />
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedOrders.map((order, idx) => {
                const orderValue = parseFloat(order.size) * order.price

                return (
                  <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-foreground">{order.pair}</td>
                    <td className="px-5 py-4 text-sm text-foreground">{order.type}</td>
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
                    <td className="px-5 py-4 text-sm font-mono text-foreground">{order.size}</td>
                    <td className="px-5 py-4 text-sm font-mono text-foreground">${orderValue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-mono text-foreground">${order.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-mono text-foreground">${order.currentPrice.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {order.reduceOnly ? "Yes" : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">
                      {order.triggerCondition ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm font-mono">
                      {order.tp || order.sl ? (
                        <div className="flex flex-col gap-0.5">
                          {order.tp && <span className="text-emerald-500">${order.tp.toLocaleString()}</span>}
                          {order.sl && <span className="text-rose-500">${order.sl.toLocaleString()}</span>}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground text-right whitespace-nowrap">{order.time}</td>
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
