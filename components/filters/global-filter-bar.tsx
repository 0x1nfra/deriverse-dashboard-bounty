"use client"

import { useFilters } from "@/hooks/use-filters"
import { TradeTypeFilter } from "@/lib/filters"
import { cn } from "@/lib/utils"

const TRADE_TYPE_OPTIONS: { value: TradeTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "long", label: "Long" },
  { value: "short", label: "Short" },
]

export function GlobalFilterBar() {
  const { filters, setTradeType } = useFilters()

  return (
    <div className="flex items-center">
      <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5 gap-0.5">
        {TRADE_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setTradeType(option.value)}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-md transition-colors",
              filters.tradeType === option.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
