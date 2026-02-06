import { useMemo } from "react"
import { mockTrades, Trade } from "@/lib/mock/trades"
import { filterTrades, DateRangePreset } from "@/lib/filters"
import { useFilters } from "./use-filters"

interface UseFilteredTradesReturn {
  filteredTrades: Trade[]
  totalTrades: number
  filteredCount: number
  dateRangeLabel: string
}

function getDateRangeLabel(preset: DateRangePreset): string {
  switch (preset) {
    case "24h":
      return "Last 24 hours"
    case "7d":
      return "Last 7 days"
    case "30d":
      return "Last 30 days"
    case "all":
      return "All time"
    default:
      return "Last 7 days"
  }
}

export function useFilteredTrades(): UseFilteredTradesReturn {
  const { filters } = useFilters()

  const filteredTrades = useMemo(() => {
    return filterTrades(mockTrades, {
      selectedSymbols: filters.selectedSymbols,
      dateRange: {
        from: filters.dateRange.from,
        to: filters.dateRange.to,
      },
    })
  }, [filters.selectedSymbols, filters.dateRange.from, filters.dateRange.to])

  const dateRangeLabel = useMemo(() => {
    return getDateRangeLabel(filters.dateRange.preset)
  }, [filters.dateRange.preset])

  return {
    filteredTrades,
    totalTrades: mockTrades.length,
    filteredCount: filteredTrades.length,
    dateRangeLabel,
  }
}
