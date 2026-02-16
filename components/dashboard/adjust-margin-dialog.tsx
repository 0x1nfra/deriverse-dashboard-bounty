"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePositionsStore } from "@/stores/positions-store"
import type { Position } from "./open-positions-table"

interface AdjustMarginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: Position
}

export function AdjustMarginDialog({ open, onOpenChange, position }: AdjustMarginDialogProps) {
  const adjustMargin = usePositionsStore((s) => s.adjustMargin)
  const [mode, setMode] = useState<"add" | "remove">("add")
  const [amount, setAmount] = useState("")

  const currentMargin = position.positionValue * position.marginPercent / 100
  const amountNum = parseFloat(amount) || 0

  const preview = useMemo(() => {
    const delta = mode === "add" ? amountNum : -amountNum
    const newMargin = Math.max(0, currentMargin + delta)
    const newMarginPercent = position.positionValue > 0
      ? (newMargin / position.positionValue) * 100
      : 0

    // Calculate liquidation price based on entry price and leverage
    // Leverage is inverse of margin ratio: leverage = 100 / marginPercent
    // Liquidation occurs when loss equals initial margin minus maintenance margin
    const leverage = newMarginPercent > 0 ? 100 / newMarginPercent : Infinity
    const maintenanceMarginRate = 0.005 // 0.5% standard maintenance margin

    // For longs: liqPrice = entryPrice * (1 - 1/leverage + maintenanceMargin)
    // For shorts: liqPrice = entryPrice * (1 + 1/leverage - maintenanceMargin)
    const liqThreshold = (1 / leverage) - maintenanceMarginRate
    const newLiqPrice = position.side === "long"
      ? position.entryPrice * (1 - liqThreshold)
      : position.entryPrice * (1 + liqThreshold)

    return { newMargin, newMarginPercent, newLiqPrice }
  }, [mode, amountNum, currentMargin, position])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Margin — {position.pair}</DialogTitle>
          <DialogDescription>
            Add or remove margin for this position.
          </DialogDescription>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="space-y-2">
          <Label>Mode</Label>
          <div className="flex gap-2">
            <Button
              variant={mode === "add" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setMode("add")}
            >
              Add
            </Button>
            <Button
              variant={mode === "remove" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setMode("remove")}
            >
              Remove
            </Button>
          </div>
        </div>

        {/* Current Margin Display */}
        <div className="rounded-md bg-secondary/50 p-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Current Margin</p>
            <p className="text-sm font-mono font-medium">
              ${currentMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Margin %</p>
            <p className="text-sm font-mono font-medium">{position.marginPercent.toFixed(1)}%</p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="margin-amount">
            Amount to {mode === "add" ? "Add" : "Remove"} (USD)
          </Label>
          <Input
            id="margin-amount"
            type="number"
            inputMode="decimal"
            step="any"
            min={0}
            max={mode === "remove" ? currentMargin : undefined}
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
            }}
            className="font-mono"
          />
        </div>

        {/* Preview Section */}
        {amountNum > 0 && (
          <div className="rounded-md bg-secondary/50 p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">New Margin</p>
                <p className={cn(
                  "text-sm font-mono font-medium",
                  mode === "add" ? "text-emerald-500" : "text-rose-500"
                )}>
                  ${preview.newMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">New Margin %</p>
                <p className={cn(
                  "text-sm font-mono font-medium",
                  mode === "add" ? "text-emerald-500" : "text-rose-500"
                )}>
                  {preview.newMarginPercent.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">New Liq Price</p>
                <p className="text-sm font-mono font-medium">
                  ${preview.newLiqPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={amountNum <= 0 || (mode === "remove" && amountNum > currentMargin)}
            onClick={() => {
              adjustMargin(position.pair, mode, amountNum)
              onOpenChange(false)
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
