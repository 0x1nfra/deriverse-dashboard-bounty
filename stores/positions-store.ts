import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Position } from "@/components/dashboard/open-positions-table"
import initialPositions from "@/lib/mock/positions.json"

const MAINTENANCE_MARGIN_RATE = 0.005

function calculateLiqPrice(
  entryPrice: number,
  marginPercent: number,
  side: "long" | "short"
): number {
  const leverage = marginPercent > 0 ? 100 / marginPercent : Infinity
  const liqThreshold = 1 / leverage - MAINTENANCE_MARGIN_RATE
  return side === "long"
    ? entryPrice * (1 - liqThreshold)
    : entryPrice * (1 + liqThreshold)
}

interface PositionsStore {
  positions: Position[]
  adjustMargin: (pair: string, mode: "add" | "remove", amount: number) => void
  closePosition: (pair: string, closePercent: number) => void
}

export const usePositionsStore = create<PositionsStore>()(
  persist(
    (set) => ({
      positions: initialPositions as Position[],

      adjustMargin: (pair, mode, amount) => {
        set((state) => ({
          positions: state.positions.map((p) => {
            if (p.pair !== pair) return p

            const currentMargin = p.positionValue * p.marginPercent / 100
            const delta = mode === "add" ? amount : -amount
            const newMargin = Math.max(0, currentMargin + delta)
            const newMarginPercent = p.positionValue > 0
              ? (newMargin / p.positionValue) * 100
              : 0
            const newLiqPrice = calculateLiqPrice(
              p.entryPrice,
              newMarginPercent,
              p.side
            )

            return {
              ...p,
              marginPercent: newMarginPercent,
              liqPrice: newLiqPrice,
            }
          }),
        }))
      },

      closePosition: (pair, closePercent) => {
        if (closePercent >= 100) {
          set((state) => ({
            positions: state.positions.filter((p) => p.pair !== pair),
          }))
        } else {
          const factor = 1 - closePercent / 100
          set((state) => ({
            positions: state.positions.map((p) => {
              if (p.pair !== pair) return p
              const newSize = parseFloat(p.size) * factor
              const newPositionValue = newSize * p.currentPrice
              const newPnlUsd = p.pnlUsd * factor
              return {
                ...p,
                size: newSize.toString(),
                positionValue: newPositionValue,
                pnlUsd: newPnlUsd,
                funding: p.funding * factor,
              }
            }),
          }))
        }
      },
    }),
    {
      name: "deriverse-positions",
      version: 1,
      migrate: () => ({ positions: initialPositions as Position[] }),
    }
  )
)
