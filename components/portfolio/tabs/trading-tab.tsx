"use client"

import { useEffect, useState } from "react"
import { RecentTradesTable } from "@/components/dashboard/recent-trades-table"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { useFilters } from "@/hooks/use-filters"
import { NoTradesState, NoFilterResultsState } from "@/components/empty-states"

export function TradingTabContent() {
  const { filteredTrades, dateRangeLabel, isLoading } = useFilteredTrades()
  const { resetFilters, isDefault } = useFilters()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle empty states
  if (!isLoading && isClient && filteredTrades.length === 0) {
    if (isDefault) {
      return (
        <div className="space-y-6">
          <NoTradesState />
        </div>
      )
    }
    return (
      <div className="space-y-6">
        <NoFilterResultsState onClearFilters={resetFilters} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recent Trades */}
      <RecentTradesTable trades={filteredTrades} />
    </div>
  )
}
