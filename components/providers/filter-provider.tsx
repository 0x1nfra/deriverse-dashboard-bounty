"use client"

import * as React from "react"
import {
  FilterState,
  DEFAULT_FILTER_STATE,
  TradeTypeFilter,
} from "@/lib/filters"

interface FilterContextType {
  filters: FilterState
  setTradeType: (type: TradeTypeFilter) => void
  resetFilters: () => void
  isDefault: boolean
}

const FilterContext = React.createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTER_STATE)

  const setTradeType = React.useCallback((type: TradeTypeFilter) => {
    setFilters({ tradeType: type })
  }, [])

  const resetFilters = React.useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE)
  }, [])

  const isDefault = filters.tradeType === "all"

  const value = React.useMemo(
    () => ({
      filters,
      setTradeType,
      resetFilters,
      isDefault,
    }),
    [filters, setTradeType, resetFilters, isDefault]
  )

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilterContext() {
  const context = React.useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider")
  }
  return context
}
