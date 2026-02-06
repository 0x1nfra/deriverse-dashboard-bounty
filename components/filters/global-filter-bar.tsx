"use client"

import { X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SymbolFilter } from "./symbol-filter"
import { DateRangeFilter } from "./date-range-filter"
import { useFilters } from "@/hooks/use-filters"

export function GlobalFilterBar() {
  const { activeFilterCount, isDefault, resetFilters } = useFilters()

  return (
    <div className="flex items-center gap-3 py-3 px-1 border-b border-border mb-6">
      <div className="flex items-center gap-2">
        <SymbolFilter />
        <DateRangeFilter />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {!isDefault && (
          <>
            <Badge
              variant="secondary"
              className="h-7 px-2.5 gap-1.5 bg-primary/10 text-primary border border-primary/20"
            >
              <Filter className="h-3 w-3" />
              {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3 w-3" />
              Clear All
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
