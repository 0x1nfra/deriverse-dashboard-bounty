"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useFilters } from "@/hooks/use-filters"
import { DEFAULT_SYMBOLS } from "@/lib/filters"

export function SymbolFilter() {
  const { filters, setSelectedSymbols } = useFilters()
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedSymbols = filters.selectedSymbols
  const allSymbols = DEFAULT_SYMBOLS

  const filteredSymbols = React.useMemo(() => {
    if (!searchQuery) return allSymbols
    return allSymbols.filter((symbol) =>
      symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, allSymbols])

  const handleSelectAll = () => {
    setSelectedSymbols([...allSymbols])
  }

  const handleClearAll = () => {
    setSelectedSymbols([])
  }

  const handleToggleSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol))
    } else {
      setSelectedSymbols([...selectedSymbols, symbol])
    }
  }

  const selectedCount = selectedSymbols.length
  const totalCount = allSymbols.length
  const isAllSelected = selectedCount === totalCount
  const isNoneSelected = selectedCount === 0

  // Display text for the trigger button
  const displayText = React.useMemo(() => {
    if (isAllSelected) return "All Symbols"
    if (isNoneSelected) return "No Symbols"
    if (selectedCount === 1) return selectedSymbols[0]
    return `${selectedCount} selected`
  }, [isAllSelected, isNoneSelected, selectedCount, selectedSymbols])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-card border-border hover:bg-accent"
        >
          <span className="truncate">{displayText}</span>
          <div className="flex items-center gap-1">
            {!isAllSelected && selectedCount > 0 && (
              <Badge
                variant="secondary"
                className="h-5 min-w-[20px] px-1.5 text-xs bg-primary/20 text-primary"
              >
                {selectedCount}
              </Badge>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 bg-card border-border" align="start">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search symbols..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-none focus:ring-0"
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No symbols found.</CommandEmpty>
            <CommandGroup>
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={isAllSelected}
                  className="h-7 text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={isNoneSelected}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
              </div>
              {filteredSymbols.map((symbol) => (
                <CommandItem
                  key={symbol}
                  value={symbol}
                  onSelect={() => handleToggleSymbol(symbol)}
                  className="cursor-pointer aria-selected:bg-accent"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedSymbols.includes(symbol)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {selectedSymbols.includes(symbol) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span className="font-mono">{symbol}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
