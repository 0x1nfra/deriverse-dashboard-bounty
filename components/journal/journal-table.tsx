"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ChevronRight, Calendar, Clock, TrendingUp, TrendingDown, Edit3, Image as ImageIcon } from "lucide-react"
import { mockJournalEntries, JournalEntry, formatDuration } from "@/lib/mock/journal-data"
import { formatCurrency } from "@/lib/mock/trades"
import type { DateRange } from "@/components/journal/journal-filters"

interface JournalTableProps {
  onEditEntry: (id: string) => void
  dateRange?: DateRange
  tag?: string
}

function getDateRangeCutoff(dateRange: DateRange): Date | null {
  if (dateRange === "all") return null
  const now = new Date()
  switch (dateRange) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    case "week": {
      const d = new Date(now)
      d.setDate(d.getDate() - 7)
      return d
    }
    case "month": {
      const d = new Date(now)
      d.setMonth(d.getMonth() - 1)
      return d
    }
    case "year": {
      const d = new Date(now)
      d.setFullYear(d.getFullYear() - 1)
      return d
    }
    default:
      return null
  }
}

export function JournalTable({ onEditEntry, dateRange = "all", tag = "all" }: JournalTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filter entries
  const filteredEntries = mockJournalEntries.filter((entry) => {
    // Date range filter
    const cutoff = getDateRangeCutoff(dateRange)
    if (cutoff && entry.timestamp < cutoff) return false

    // Tag filter
    if (tag !== "all" && !entry.tags.includes(tag)) return false

    return true
  })

  // Sort entries by timestamp (newest first)
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )

  const handleCardClick = (entryId: string) => {
    setExpandedId(expandedId === entryId ? null : entryId)
  }

  const handleEditClick = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation() // Prevent card toggle
    onEditEntry(entryId)
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
  const [screenshotsOpen, setScreenshotsOpen] = useState(false)
  const isWin = entry.pnl >= 0

  return (
    <motion.div
      layout
      onClick={onCardClick}
      className={cn(
        "group bg-card border border-white/[0.06] rounded-lg overflow-hidden cursor-pointer transition-all duration-300",
        isExpanded
          ? "border-primary/30 shadow-[0_0_16px_rgba(84,113,246,0.12),0_8px_24px_rgba(0,0,0,0.2)] bg-primary/[0.02]"
          : "hover:border-white/[0.12] hover:shadow-md"
      )}
      initial={false}
      animate={{
        borderColor: isExpanded ? "hsl(var(--primary) / 0.3)" : "rgba(255,255,255,0.06)",
        scale: isExpanded ? 1.005 : 1,
      }}
      transition={{ duration: 0.25 }}
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

          {/* Right side: P&L, Edit, and Expand Icon */}
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

            {/* Edit Icon */}
            <button
              type="button"
              onClick={onEditClick}
              className="p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10 transition-all"
              title="Edit entry"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

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
              <div className="p-4">
                {/* Section 1: Trade Details */}
                {/* Trade Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {/* Entry Price */}
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2.5">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Entry
                    </div>
                    <div className="text-sm font-mono font-medium text-foreground">
                      {formatCurrency(entry.entryPrice)}
                    </div>
                  </div>

                  {/* Exit Price */}
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2.5">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Exit
                    </div>
                    <div className={cn(
                      "text-sm font-mono font-medium",
                      entry.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {formatCurrency(entry.exitPrice)}
                    </div>
                  </div>

                  {/* Position Size */}
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2.5">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Size
                    </div>
                    <div className="text-sm font-mono font-medium text-foreground">
                      {entry.size.toLocaleString()} <span className="text-muted-foreground text-xs">{entry.symbol}</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2.5">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Duration
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{formatDuration(entry.duration)}</span>
                    </div>
                  </div>

                  {/* Strategy + Emotion */}
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2.5">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Strategy
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{entry.strategy}</span>
                      <span className="text-base" title={entry.emotionalState.label}>{entry.emotionalState.emoji}</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60 my-4" />

                {/* Section 2: Setup Description */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Setup Description
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {entry.setupDescription}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60 my-4" />

                {/* Section 3: Entry & Exit Rationale */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Entry Rationale
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {entry.entryRationale}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Exit Rationale
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {entry.exitRationale}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60 my-4" />

                {/* Section 4: Tags */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tags</span>
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
                </div>

                {/* Screenshots (Collapsible) */}
                {entry.screenshots.length > 0 && (
                  <>
                    {/* Divider */}
                    <div className="h-px bg-border/60 my-4" />

                    {/* Section 5: Screenshots */}
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setScreenshotsOpen(!screenshotsOpen)
                        }}
                        className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground/70 transition-colors w-full"
                      >
                        <motion.div
                          animate={{ rotate: screenshotsOpen ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </motion.div>
                        <ImageIcon className="h-3.5 w-3.5" />
                        Screenshots ({entry.screenshots.length})
                      </button>

                      <AnimatePresence>
                        {screenshotsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
