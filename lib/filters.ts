import { Trade } from "@/lib/mock/trades"

export type TradeTypeFilter = "all" | "active" | "long" | "short"

export interface FilterState {
  tradeType: TradeTypeFilter
}

export const DEFAULT_FILTER_STATE: FilterState = { tradeType: "all" }

export function filterTrades(trades: Trade[], tradeType: TradeTypeFilter): Trade[] {
  switch (tradeType) {
    case "long":
      return trades.filter((t) => t.side === "long")
    case "short":
      return trades.filter((t) => t.side === "short")
    case "active":
      return trades.filter((t) => !t.exitPrice)
    case "all":
    default:
      return trades
  }
}
