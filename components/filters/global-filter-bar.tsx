"use client"

import { X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SymbolFilter } from "@/components/filters/symbol-filter"
import { DateRangeFilter } from "@/components/filters/date-range-filter"
import { useFilters } from "@/hooks/use-filters"

export function GlobalFilterBar() {
  const { activeFilterCount, isDefault, resetFilters } = useFilters()

  return (
    <div className="flex items-center justify-between gap-3 py-3 px-1 border-b border-border mb-6 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <SymbolFilter />
        <DateRangeFilter />
      </div>

      <div className="flex items-center gap-2">
        {!isDefault && (
          <>
            <Badge
              variant="secondary"
              className="h-7 px-2.5 gap-1.5 bg-primary/10 text-primary border border-primary/20"
            >
              <Filter className="h-3 w-3" />
              <span className="hidden sm:inline">{activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active</span>
              <span className="sm:hidden">{activeFilterCount}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3 w-3" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
