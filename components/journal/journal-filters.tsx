"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type DateRange = "all" | "today" | "week" | "month" | "year"

export interface JournalFilterValues {
  dateRange: DateRange
  tag: string
}

interface JournalFiltersProps {
  onFilterChange: (filters: JournalFilterValues) => void
  filters: JournalFilterValues
  availableTags: string[]
}

export function JournalFilters({ onFilterChange, filters, availableTags }: JournalFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Date Range */}
      <Select
        value={filters.dateRange}
        onValueChange={(value: DateRange) =>
          onFilterChange({ ...filters, dateRange: value })
        }
      >
        <SelectTrigger className="w-[130px] h-8 text-xs bg-card border-border">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>

      {/* Tags */}
      <Select
        value={filters.tag}
        onValueChange={(value: string) =>
          onFilterChange({ ...filters, tag: value })
        }
      >
        <SelectTrigger className="w-[120px] h-8 text-xs bg-card border-border">
          <SelectValue placeholder="Tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tags</SelectItem>
          {availableTags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
