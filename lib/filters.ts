import { Trade } from "@/lib/mock/trades"

export type DateRangePreset = "24h" | "7d" | "30d" | "all"

export interface FilterState {
  selectedSymbols: string[]
  dateRange: {
    preset: DateRangePreset
    from: Date | null
    to: Date | null
  }
}

export const DEFAULT_SYMBOLS = ["SOL", "ETH", "BTC", "BONK", "JUP", "WIF", "PEPE", "DOGE"]

export const DEFAULT_FILTER_STATE: FilterState = {
  selectedSymbols: [...DEFAULT_SYMBOLS],
  dateRange: {
    preset: "7d",
    from: null,
    to: null,
  },
}

export function getDateRangeFromPreset(
  preset: DateRangePreset,
  referenceDate?: Date
): { from: Date; to: Date } {
  // Use provided reference date or default to new Date()
  // Callers should pass a stable reference date to ensure SSR/client consistency
  const now = referenceDate ?? new Date()
  const to = now
  let from = new Date(now)

  switch (preset) {
    case "24h":
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case "7d":
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "30d":
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "all":
      // For "all", we'll use a date far in the past
      from = new Date(0)
      break
  }

  return { from, to }
}

export function isWithinDateRange(date: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return true
  return date >= from && date <= to
}

export function getSymbolsFromTrades(trades: Trade[]): string[] {
  const symbols = new Set(trades.map((trade) => trade.symbol))
  return Array.from(symbols).sort()
}

export interface FilterTradesOptions {
  selectedSymbols?: string[]
  dateRange?: {
    from: Date | null
    to: Date | null
  }
}

export function filterTrades(trades: Trade[], options: FilterTradesOptions): Trade[] {
  const { selectedSymbols, dateRange } = options

  return trades.filter((trade) => {
    // Filter by symbols
    if (selectedSymbols && selectedSymbols.length > 0) {
      if (!selectedSymbols.includes(trade.symbol)) {
        return false
      }
    }

    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      if (!isWithinDateRange(trade.timestamp, dateRange.from, dateRange.to)) {
        return false
      }
    }

    return true
  })
}

export function getActiveFilterCount(
  selectedSymbols: string[],
  dateRangePreset: DateRangePreset
): number {
  let count = 0

  // Check if symbols filter is active (not all symbols selected)
  if (selectedSymbols.length !== DEFAULT_SYMBOLS.length) {
    count++
  }

  // Check if date range filter is active (not default 7d)
  if (dateRangePreset !== "7d") {
    count++
  }

  return count
}

export function isDefaultFilterState(state: FilterState): boolean {
  return (
    state.selectedSymbols.length === DEFAULT_SYMBOLS.length &&
    state.dateRange.preset === "7d"
  )
}

export function serializeFiltersToUrl(state: FilterState): string {
  const params = new URLSearchParams()

  if (state.selectedSymbols.length !== DEFAULT_SYMBOLS.length) {
    params.set("symbols", state.selectedSymbols.join(","))
  }

  if (state.dateRange.preset !== "7d") {
    params.set("range", state.dateRange.preset)
  }

  return params.toString()
}

export function parseFiltersFromUrl(searchParams: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {}

  // Parse symbols
  const symbolsParam = searchParams.get("symbols")
  if (symbolsParam) {
    const symbols = symbolsParam.split(",").filter((s) => DEFAULT_SYMBOLS.includes(s))
    if (symbols.length > 0) {
      filters.selectedSymbols = symbols
    }
  }

  // Parse date range preset
  const rangeParam = searchParams.get("range")
  if (rangeParam && ["24h", "7d", "30d", "all"].includes(rangeParam)) {
    filters.dateRange = {
      preset: rangeParam as DateRangePreset,
      from: null,
      to: null,
    }
  }

  return filters
}
