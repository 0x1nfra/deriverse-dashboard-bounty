"use client"

import { useState } from "react"
import { X, Upload, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface JournalEntryModalProps {
  isOpen: boolean
  onClose: () => void
  editingEntryId: string | null
}

const emotionalStates = [
  { emoji: "😊", label: "Confident", color: "bg-success" },
  { emoji: "👍", label: "Good", color: "bg-success" },
  { emoji: "😐", label: "Neutral", color: "bg-warning" },
  { emoji: "😰", label: "Anxious", color: "bg-warning" },
  { emoji: "😤", label: "Frustrated", color: "bg-destructive" },
  { emoji: "😡", label: "Angry", color: "bg-destructive" },
]

const tradeTags = ["Scalp", "Breakout", "Long", "Momentum"]

export function JournalEntryModal({ isOpen, onClose, editingEntryId }: JournalEntryModalProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formData, setFormData] = useState({
    assetPair: "SOL-PERP",
    entryPrice: "98.50",
    exitPrice: "102.30",
    positionSize: "100 SOL",
    tradeDate: "",
    pnlDate: "",
    strategy: "",
    setupDescription: "",
    entryRationale: "",
    exitRationale: "",
  })

  // Calculate P&L
  const entryPrice = parseFloat(formData.entryPrice) || 0
  const exitPrice = parseFloat(formData.exitPrice) || 0
  const pnlAmount = exitPrice - entryPrice
  const pnlPercent = entryPrice > 0 ? ((pnlAmount / entryPrice) * 100).toFixed(2) : "0.00"
  const isProfit = pnlAmount >= 0

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSave = () => {
    console.log("Saving journal entry:", {
      ...formData,
      emotion: selectedEmotion !== null ? emotionalStates[selectedEmotion].label : null,
      tags: selectedTags,
      pnlAmount,
      pnlPercent,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {editingEntryId ? "Edit Journal Entry" : "New Journal Entry"}
            </DialogTitle>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Trade Information */}
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Trade Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assetPair">Asset Pair</Label>
                  <Select
                    value={formData.assetPair}
                    onValueChange={(value) => setFormData({ ...formData, assetPair: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOL-PERP">SOL-PERP</SelectItem>
                      <SelectItem value="BTC-PERP">BTC-PERP</SelectItem>
                      <SelectItem value="ETH-PERP">ETH-PERP</SelectItem>
                      <SelectItem value="XRP-PERP">XRP-PERP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    id="entryPrice"
                    value={`$${formData.entryPrice}`}
                    onChange={(e) =>
                      setFormData({ ...formData, entryPrice: e.target.value.replace("$", "") })
                    }
                    className="bg-secondary border-border font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price</Label>
                  <Input
                    id="exitPrice"
                    value={`$${formData.exitPrice}`}
                    onChange={(e) =>
                      setFormData({ ...formData, exitPrice: e.target.value.replace("$", "") })
                    }
                    className="bg-secondary border-border font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positionSize">Position Size</Label>
                  <div className="relative">
                    <Input
                      id="positionSize"
                      value={formData.positionSize}
                      onChange={(e) =>
                        setFormData({ ...formData, positionSize: e.target.value })
                      }
                      className="bg-secondary border-border font-mono pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="tradeDate">Trade Date</Label>
                    <Input
                      id="tradeDate"
                      type="date"
                      value={formData.tradeDate}
                      onChange={(e) =>
                        setFormData({ ...formData, tradeDate: e.target.value })
                      }
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pnlDate">P&L Date</Label>
                    <Input
                      id="pnlDate"
                      type="date"
                      value={formData.pnlDate}
                      onChange={(e) =>
                        setFormData({ ...formData, pnlDate: e.target.value })
                      }
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* P&L Display */}
                <div className="pt-2">
                  <p
                    className={cn(
                      "text-3xl font-mono font-bold",
                      isProfit ? "text-success" : "text-destructive"
                    )}
                  >
                    {isProfit ? "+" : ""}${(pnlAmount * 100).toFixed(2)} ({pnlPercent}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Journal Content */}
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Journal Content
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy</Label>
                  <Input
                    id="strategy"
                    placeholder="e.g., Breakout, Mean Reversion"
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setupDescription">Setup Description</Label>
                  <Input
                    id="setupDescription"
                    placeholder="Describe the trade setup"
                    value={formData.setupDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, setupDescription: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryRationale">Entry Rationale</Label>
                  <Input
                    id="entryRationale"
                    placeholder="Why did you enter?"
                    value={formData.entryRationale}
                    onChange={(e) =>
                      setFormData({ ...formData, entryRationale: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exitRationale">Exit Rationale</Label>
                  <Input
                    id="exitRationale"
                    placeholder="Why did you exit?"
                    value={formData.exitRationale}
                    onChange={(e) =>
                      setFormData({ ...formData, exitRationale: e.target.value })
                    }
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Emotional State */}
                <div className="space-y-2">
                  <Label>Emotional State</Label>
                  <div className="flex items-center gap-2">
                    {emotionalStates.map((state, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedEmotion(idx)}
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center text-xl transition-all",
                          selectedEmotion === idx
                            ? `${state.color} ring-2 ring-offset-2 ring-offset-card ring-primary`
                            : "bg-secondary hover:bg-secondary/80"
                        )}
                        title={state.label}
                      >
                        {state.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart Screenshot Upload */}
                <div className="space-y-2">
                  <Label>Chart Screenshot</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {tradeTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={cn(
                            "px-2 py-0.5 text-xs rounded transition-colors",
                            selectedTags.includes(tag)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload or drag & drop file here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-secondary/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
