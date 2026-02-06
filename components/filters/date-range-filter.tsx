"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useFilters } from "@/hooks/use-filters"
import { DateRangePreset } from "@/lib/filters"

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "all", label: "All" },
]

export function DateRangeFilter() {
  const { filters, setDateRangePreset } = useFilters()
  const currentPreset = filters.dateRange.preset

  return (
    <div className="flex items-center gap-1 bg-card rounded-md p-1 border border-border">
      {PRESETS.map((preset) => (
        <Button
          key={preset.value}
          variant="ghost"
          size="sm"
          onClick={() => setDateRangePreset(preset.value)}
          className={cn(
            "h-7 px-3 text-xs font-medium transition-all",
            currentPreset === preset.value
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  )
}
