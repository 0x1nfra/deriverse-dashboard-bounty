"use client"

import { useState, useEffect } from "react"
import { X, Upload, TrendingUp, TrendingDown, BarChart3, FileText, Smile, Image as ImageIcon, Tag } from "lucide-react"
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
import { getJournalEntryByTradeId } from "@/lib/mock/journal-data"

interface JournalEntryModalProps {
  isOpen: boolean
  onClose: () => void
  editingEntryId: string | null
}

const emotionalStates = [
  { emoji: "😊", label: "Confident", color: "bg-success" },
  { emoji: "👍", label: "Good", color: "bg-success" },
  { emoji: "😐", label: "Neutral", color: "bg-yellow-500" },
  { emoji: "😰", label: "Anxious", color: "bg-orange-500" },
  { emoji: "😤", label: "Frustrated", color: "bg-destructive" },
  { emoji: "😡", label: "Angry", color: "bg-destructive" },
]

const tradeTags = ["Scalp", "Breakout", "Long", "Momentum", "Swing", "Day Trade"]

export function JournalEntryModal({ isOpen, onClose, editingEntryId }: JournalEntryModalProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formData, setFormData] = useState({
    assetPair: "SOL-PERP",
    direction: "long",
    entryPrice: "98.50",
    exitPrice: "102.30",
    positionSize: "100",
    positionUnit: "SOL",
    tradeDate: "",
    strategy: "",
    setupDescription: "",
    entryRationale: "",
    exitRationale: "",
  })

  // Populate form data when editing an existing entry
  useEffect(() => {
    if (editingEntryId) {
      const entry = getJournalEntryByTradeId(editingEntryId)
      if (entry) {
        setFormData({
          assetPair: `${entry.symbol}-PERP`,
          direction: entry.side,
          entryPrice: entry.entryPrice.toString(),
          exitPrice: entry.exitPrice.toString(),
          positionSize: entry.size.toString(),
          positionUnit: entry.symbol,
          tradeDate: entry.timestamp.toISOString().slice(0, 16),
          strategy: entry.strategy,
          setupDescription: entry.setupDescription,
          entryRationale: entry.entryRationale,
          exitRationale: entry.exitRationale,
        })
        
        // Set emotional state
        const emotionIndex = emotionalStates.findIndex(
          state => state.label === entry.emotionalState.label
        )
        setSelectedEmotion(emotionIndex >= 0 ? emotionIndex : null)
        
        // Set tags
        setSelectedTags(entry.tags)
      }
    } else {
      // Reset to defaults for new entry
      setFormData({
        assetPair: "SOL-PERP",
        direction: "long",
        entryPrice: "",
        exitPrice: "",
        positionSize: "",
        positionUnit: "SOL",
        tradeDate: "",
        strategy: "",
        setupDescription: "",
        entryRationale: "",
        exitRationale: "",
      })
      setSelectedEmotion(null)
      setSelectedTags([])
    }
  }, [editingEntryId, isOpen])

  // Calculate P&L with direction
  const entryPrice = parseFloat(formData.entryPrice) || 0
  const exitPrice = parseFloat(formData.exitPrice) || 0
  const positionSize = parseFloat(formData.positionSize) || 0
  const sign = formData.direction === "short" ? -1 : 1
  const pnlAmount = sign * (exitPrice - entryPrice) * positionSize
  const pnlPercent = entryPrice > 0 ? sign * ((exitPrice - entryPrice) / entryPrice) * 100 : 0
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
      <DialogContent className="max-w-lg bg-card border-border p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {editingEntryId ? "Edit Journal Entry" : "New Journal Entry"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
          <div className="space-y-6">
            
            {/* Section 1: Trade Details */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <BarChart3 className="h-4 w-4" />
                Trade Details
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="assetPair" className="text-xs">Asset Pair</Label>
                    <Select
                      value={formData.assetPair}
                      onValueChange={(value) => setFormData({ ...formData, assetPair: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border h-9">
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
                    <Label htmlFor="direction" className="text-xs">Direction</Label>
                    <div className="flex rounded-md overflow-hidden border border-border">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, direction: "long" })}
                        className={cn(
                          "flex-1 py-2 text-xs font-medium transition-colors",
                          formData.direction === "long"
                            ? "bg-success text-white"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        LONG
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, direction: "short" })}
                        className={cn(
                          "flex-1 py-2 text-xs font-medium transition-colors",
                          formData.direction === "short"
                            ? "bg-destructive text-white"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        SHORT
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="entryPrice" className="text-xs">Entry Price</Label>
                    <Input
                      id="entryPrice"
                      type="number"
                      step="0.01"
                      value={formData.entryPrice}
                      onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                      className="bg-secondary border-border h-9 font-mono"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exitPrice" className="text-xs">Exit Price</Label>
                    <Input
                      id="exitPrice"
                      type="number"
                      step="0.01"
                      value={formData.exitPrice}
                      onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                      className="bg-secondary border-border h-9 font-mono"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positionSize" className="text-xs">Position Size</Label>
                  <div className="flex gap-2">
                    <Input
                      id="positionSize"
                      type="number"
                      value={formData.positionSize}
                      onChange={(e) => setFormData({ ...formData, positionSize: e.target.value })}
                      className="bg-secondary border-border h-9 font-mono flex-1"
                      placeholder="100"
                    />
                    <Select
                      value={formData.positionUnit}
                      onValueChange={(value) => setFormData({ ...formData, positionUnit: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border h-9 w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tradeDate" className="text-xs">Trade Date</Label>
                  <Input
                    id="tradeDate"
                    type="datetime-local"
                    value={formData.tradeDate}
                    onChange={(e) => setFormData({ ...formData, tradeDate: e.target.value })}
                    className="bg-secondary border-border h-9"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: P&L Result */}
            <section className={cn(
              "p-4 rounded-lg border",
              isProfit ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  P&L Result
                </span>
                {isProfit ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className={cn(
                "text-2xl font-mono font-bold mt-1",
                isProfit ? "text-success" : "text-destructive"
              )}>
                {isProfit ? "+" : ""}${Math.abs(pnlAmount).toFixed(2)}
              </div>
              <div className={cn(
                "text-sm font-mono",
                isProfit ? "text-success/80" : "text-destructive/80"
              )}>
                {isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%
              </div>
            </section>

            {/* Section 3: Journal Content */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <FileText className="h-4 w-4" />
                Journal Content
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="strategy" className="text-xs">Strategy</Label>
                  <Input
                    id="strategy"
                    placeholder="e.g., Breakout, Mean Reversion"
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="bg-secondary border-border h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setupDescription" className="text-xs">Setup Description</Label>
                  <Textarea
                    id="setupDescription"
                    placeholder="Describe the trade setup and market conditions..."
                    value={formData.setupDescription}
                    onChange={(e) => setFormData({ ...formData, setupDescription: e.target.value })}
                    className="bg-secondary border-border min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryRationale" className="text-xs">Entry Rationale</Label>
                  <Textarea
                    id="entryRationale"
                    placeholder="Why did you enter this trade?"
                    value={formData.entryRationale}
                    onChange={(e) => setFormData({ ...formData, entryRationale: e.target.value })}
                    className="bg-secondary border-border min-h-[60px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exitRationale" className="text-xs">Exit Rationale</Label>
                  <Textarea
                    id="exitRationale"
                    placeholder="Why did you exit this trade?"
                    value={formData.exitRationale}
                    onChange={(e) => setFormData({ ...formData, exitRationale: e.target.value })}
                    className="bg-secondary border-border min-h-[60px] resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 4: Emotional State */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <Smile className="h-4 w-4" />
                Emotional State
              </div>
              
              <div className="flex items-center gap-2">
                {emotionalStates.map((state, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedEmotion(idx)}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center text-lg transition-all",
                      selectedEmotion === idx
                        ? `${state.color} ring-2 ring-offset-2 ring-offset-card ring-primary scale-110`
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                    title={state.label}
                  >
                    {state.emoji}
                  </button>
                ))}
              </div>
              {selectedEmotion !== null && (
                <p className="text-xs text-muted-foreground">
                  Selected: {emotionalStates[selectedEmotion].label}
                </p>
              )}
            </section>

            {/* Section 5: Chart Screenshots */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <ImageIcon className="h-4 w-4" />
                Chart Screenshots
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-secondary/20">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Drop screenshots here or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </section>

            {/* Section 6: Tags */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                <Tag className="h-4 w-4" />
                Tags
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tradeTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full transition-colors border",
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-primary/50"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-secondary/30">
          <Button variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button onClick={handleSave} size="sm" className="bg-primary hover:bg-primary/90">
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
