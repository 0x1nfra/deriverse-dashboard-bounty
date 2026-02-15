"use client"

import { useMemo } from "react"
import { useMockTrades, Trade } from "@/lib/mock/trades"
import { filterTrades } from "@/lib/filters"
import { useFilters } from "@/hooks/use-filters"

interface UseFilteredTradesReturn {
  filteredTrades: Trade[]
  totalTrades: number
  filteredCount: number
  isLoading: boolean
}

export function useFilteredTrades(applyFilters: boolean = true): UseFilteredTradesReturn {
  const { filters } = useFilters()
  const { trades: mockTrades, isLoading } = useMockTrades()

  const filteredTrades = useMemo(() => {
    if (isLoading || mockTrades.length === 0) return []

    if (!applyFilters) return mockTrades

    return filterTrades(mockTrades, filters.tradeType)
  }, [applyFilters, filters.tradeType, mockTrades, isLoading])

  return {
    filteredTrades,
    totalTrades: mockTrades.length,
    filteredCount: filteredTrades.length,
    isLoading,
  }
}
