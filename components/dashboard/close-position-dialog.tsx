"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Position } from "./open-positions-table"

interface ClosePositionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: Position
}

export function ClosePositionDialog({ open, onOpenChange, position }: ClosePositionDialogProps) {
  const [closeType, setCloseType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState(position.currentPrice.toString())
  const [closePercent, setClosePercent] = useState(100)

  const size = parseFloat(position.size)
  const closeSize = size * (closePercent / 100)
  const symbol = position.pair.split("/")[0]

  const closePrice = closeType === "market" ? position.currentPrice : (parseFloat(limitPrice) || position.currentPrice)

  const estimatedPnl = useMemo(() => {
    const priceDiff = position.side === "long"
      ? closePrice - position.entryPrice
      : position.entryPrice - closePrice
    return priceDiff * closeSize
  }, [closePrice, position.entryPrice, position.side, closeSize])

  const pnlPercent = useMemo(() => {
    if (position.entryPrice === 0) return 0
    const priceDiff = position.side === "long"
      ? closePrice - position.entryPrice
      : position.entryPrice - closePrice
    return (priceDiff / position.entryPrice) * 100
  }, [closePrice, position.entryPrice, position.side])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Close Position — {position.pair}
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
              position.side === "long"
                ? "bg-emerald-500/20 text-emerald-500"
                : "bg-rose-500/20 text-rose-500"
            )}>
              {position.side.toUpperCase()}
            </span>
          </DialogTitle>
          <DialogDescription>
            Review and confirm position closure details.
          </DialogDescription>
        </DialogHeader>

        {/* Position Summary */}
        <div className="grid grid-cols-4 gap-3 rounded-md bg-secondary/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Size</p>
            <p className="text-sm font-mono font-medium">{position.size} {symbol}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Entry</p>
            <p className="text-sm font-mono font-medium">${position.entryPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mark Price</p>
            <p className="text-sm font-mono font-medium">${position.currentPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current PnL</p>
            <p className={cn(
              "text-sm font-mono font-medium",
              position.pnlPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              {position.pnlPositive ? "+" : ""}${position.pnlUsd.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Close Type Toggle */}
        <div className="space-y-2">
          <Label>Close Type</Label>
          <div className="flex gap-2">
            <Button
              variant={closeType === "market" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setCloseType("market")}
            >
              Market
            </Button>
            <Button
              variant={closeType === "limit" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setCloseType("limit")}
            >
              Limit
            </Button>
          </div>
        </div>

        {/* Limit Price Input */}
        {closeType === "limit" && (
          <div className="space-y-2">
            <Label htmlFor="limit-price">Limit Price</Label>
            <Input
              id="limit-price"
              type="number"
              step="any"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="font-mono"
            />
          </div>
        )}

        {/* Close Amount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Close Amount</Label>
            <span className="text-sm text-muted-foreground font-mono">
              {closeSize.toFixed(symbol === "BTC" ? 4 : 2)} of {position.size} {symbol}
            </span>
          </div>
          <Slider
            value={[closePercent]}
            onValueChange={([val]) => setClosePercent(val)}
            min={0}
            max={100}
            step={1}
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={100}
              value={closePercent}
              onChange={(e) => setClosePercent(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-20 font-mono text-center"
            />
            <span className="text-sm text-muted-foreground">%</span>
            <div className="flex gap-1 ml-auto">
              {[25, 50, 75, 100].map((pct) => (
                <Button
                  key={pct}
                  variant="outline"
                  size="sm"
                  className={cn("h-7 px-2 text-xs", closePercent === pct && "border-primary text-primary")}
                  onClick={() => setClosePercent(pct)}
                >
                  {pct}%
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Estimated PnL Preview */}
        <div className="rounded-md bg-secondary/50 p-3 space-y-1">
          <p className="text-xs text-muted-foreground">Estimated PnL</p>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-lg font-mono font-semibold",
              estimatedPnl >= 0 ? "text-emerald-500" : "text-rose-500"
            )}>
              {estimatedPnl >= 0 ? "+" : ""}${estimatedPnl.toFixed(2)}
            </span>
            <span className={cn(
              "text-sm font-mono",
              pnlPercent >= 0 ? "text-emerald-500" : "text-rose-500"
            )}>
              ({pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={closePercent === 0}
            onClick={() => {
              console.log("Close position:", {
                pair: position.pair,
                closeType,
                closePercent,
                closeSize,
                limitPrice: closeType === "limit" ? parseFloat(limitPrice) : undefined,
              })
              onOpenChange(false)
            }}
          >
            Close Position
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
