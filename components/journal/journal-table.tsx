"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Calendar, Clock, TrendingUp, TrendingDown, Edit3, Image as ImageIcon } from "lucide-react"
import { mockJournalEntries, JournalEntry, formatDuration } from "@/lib/mock/journal-data"
import { formatCurrency } from "@/lib/mock/trades"
import { JournalEntryModal } from "@/components/journal/journal-entry-modal"

interface JournalTableProps {
  onEditEntry: (id: string) => void
}

export function JournalTable({ onEditEntry }: JournalTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)

  // Sort entries by timestamp (newest first)
  const sortedEntries = [...mockJournalEntries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )

  const handleCardClick = (entryId: string) => {
    setExpandedId(expandedId === entryId ? null : entryId)
  }

  const handleEditClick = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation() // Prevent card toggle
    setEditingEntryId(entryId)
    setIsModalOpen(true)
    onEditEntry(entryId)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEntryId(null)
  }

  if (sortedEntries.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-8 text-center text-muted-foreground">
          No journal entries found
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {sortedEntries.map((entry) => (
          <JournalCard
            key={entry.id}
            entry={entry}
            isExpanded={expandedId === entry.id}
            onCardClick={() => handleCardClick(entry.id)}
            onEditClick={(e) => handleEditClick(e, entry.id)}
          />
        ))}

        {/* Show count */}
        <div className="text-center text-sm text-muted-foreground pt-2">
          Showing {sortedEntries.length} journal entries
        </div>
      </div>

      {/* Edit Modal */}
      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingEntryId={editingEntryId}
      />
    </>
  )
}

interface JournalCardProps {
  entry: JournalEntry
  isExpanded: boolean
  onCardClick: () => void
  onEditClick: (e: React.MouseEvent) => void
}

function JournalCard({ entry, isExpanded, onCardClick, onEditClick }: JournalCardProps) {
  const isWin = entry.pnl >= 0

  return (
    <motion.div
      layout
      onClick={onCardClick}
      className={cn(
        "bg-card border rounded-lg overflow-hidden cursor-pointer transition-colors",
        isExpanded 
          ? "border-primary/50 shadow-lg" 
          : "border-border hover:border-primary/30 hover:shadow-md"
      )}
      initial={false}
      animate={{
        borderColor: isExpanded ? "hsl(var(--primary) / 0.5)" : "hsl(var(--border))",
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Compact View */}
      <motion.div layout="position" className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side: Date and Asset */}
          <div className="flex items-center gap-4">
            {/* Date */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">
                {entry.timestamp.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Asset and Side */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {entry.symbol}/USD
              </span>
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold",
                  entry.side === "long"
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-rose-500/20 text-rose-500"
                )}
              >
                {entry.side === "long" ? "LONG" : "SHORT"}
              </span>
            </div>
          </div>

          {/* Right side: P&L and Expand Icon */}
          <div className="flex items-center gap-3">
            {/* P&L */}
            <div className={cn(
              "text-base font-mono font-semibold",
              isWin ? "text-emerald-500" : "text-rose-500"
            )}>
              {isWin ? "+" : ""}
              {formatCurrency(entry.pnl)}
              <span className="text-xs ml-1 opacity-80">
                ({isWin ? "+" : ""}
                {entry.pnlPercentage.toFixed(2)}%)
              </span>
            </div>

            {/* Expand/Collapse Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-border bg-secondary/20">
              <div className="p-4 space-y-4">
                {/* Trade Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Entry/Exit */}
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Entry → Exit
                    </div>
                    <div className="text-sm font-mono text-foreground">
                      {formatCurrency(entry.entryPrice)}
                    </div>
                    <div className="text-sm font-mono text-muted-foreground">
                      → {formatCurrency(entry.exitPrice)}
                    </div>
                  </div>

                  {/* Position Size */}
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Position Size
                    </div>
                    <div className="text-sm font-mono text-foreground">
                      {entry.size.toLocaleString()} {entry.symbol}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Duration
                    </div>
                    <div className="flex items-center gap-1 text-sm text-foreground">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatDuration(entry.duration)}</span>
                    </div>
                  </div>

                  {/* Strategy */}
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Strategy
                    </div>
                    <div className="text-sm text-foreground font-medium">
                      {entry.strategy}
                    </div>
                  </div>
                </div>

                {/* Emotional State */}
                <div className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Emotional State:
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{entry.emotionalState.emoji}</span>
                    <span className="text-sm text-foreground">
                      {entry.emotionalState.label}
                    </span>
                  </div>
                </div>

                {/* Setup Description */}
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Setup Description
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {entry.setupDescription}
                  </p>
                </div>

                {/* Entry Rationale */}
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Entry Rationale
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {entry.entryRationale}
                  </p>
                </div>

                {/* Exit Rationale */}
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Exit Rationale
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {entry.exitRationale}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Screenshots */}
                {entry.screenshots.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Screenshots ({entry.screenshots.length})
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {entry.screenshots.map((screenshot, idx) => (
                        <div
                          key={idx}
                          className="aspect-[4/3] rounded-lg overflow-hidden border border-border bg-secondary"
                        >
                          <img
                            src={screenshot}
                            alt={`Chart ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEditClick}
                    className="gap-2"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Entry
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
