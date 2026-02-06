"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  FilterState,
  DEFAULT_FILTER_STATE,
  DEFAULT_SYMBOLS,
  getDateRangeFromPreset,
  parseFiltersFromUrl,
  serializeFiltersToUrl,
  DateRangePreset,
} from "@/lib/filters"

interface FilterContextType {
  filters: FilterState
  setSelectedSymbols: (symbols: string[]) => void
  setDateRangePreset: (preset: DateRangePreset) => void
  resetFilters: () => void
  activeFilterCount: number
  isDefault: boolean
}

const FilterContext = React.createContext<FilterContextType | undefined>(undefined)

function FilterProviderInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize state from URL or defaults
  const [filters, setFilters] = React.useState<FilterState>(() => {
    const urlFilters = parseFiltersFromUrl(searchParams)
    const initialState = {
      ...DEFAULT_FILTER_STATE,
      ...urlFilters,
    }

    // Calculate date range from preset
    if (initialState.dateRange) {
      const { from, to } = getDateRangeFromPreset(initialState.dateRange.preset)
      initialState.dateRange.from = from
      initialState.dateRange.to = to
    }

    return initialState
  })

  // Update URL when filters change
  React.useEffect(() => {
    const queryString = serializeFiltersToUrl(filters)
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [filters, pathname, router])

  const setSelectedSymbols = React.useCallback((symbols: string[]) => {
    setFilters((prev) => ({
      ...prev,
      selectedSymbols: symbols,
    }))
  }, [])

  const setDateRangePreset = React.useCallback((preset: DateRangePreset) => {
    const { from, to } = getDateRangeFromPreset(preset)
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        preset,
        from,
        to,
      },
    }))
  }, [])

  const resetFilters = React.useCallback(() => {
    const { from, to } = getDateRangeFromPreset("7d")
    setFilters({
      selectedSymbols: [...DEFAULT_SYMBOLS],
      dateRange: {
        preset: "7d",
        from,
        to,
      },
    })
  }, [])

  // Calculate active filter count
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.selectedSymbols.length !== DEFAULT_SYMBOLS.length) {
      count++
    }
    if (filters.dateRange.preset !== "7d") {
      count++
    }
    return count
  }, [filters])

  const isDefault = React.useMemo(() => {
    return (
      filters.selectedSymbols.length === DEFAULT_SYMBOLS.length &&
      filters.dateRange.preset === "7d"
    )
  }, [filters])

  const value = React.useMemo(
    () => ({
      filters,
      setSelectedSymbols,
      setDateRangePreset,
      resetFilters,
      activeFilterCount,
      isDefault,
    }),
    [filters, setSelectedSymbols, setDateRangePreset, resetFilters, activeFilterCount, isDefault]
  )

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <FilterProviderInner>{children}</FilterProviderInner>
    </React.Suspense>
  )
}

export function useFilterContext() {
  const context = React.useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider")
  }
  return context
}
