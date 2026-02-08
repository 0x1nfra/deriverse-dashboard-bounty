"use client"

import { useState, useEffect } from "react"
import { JournalTable } from "@/components/journal/journal-table"
import { JournalEntryModal } from "@/components/journal/journal-entry-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { useFilters } from "@/hooks/use-filters"
import { NoTradesState, NoFilterResultsState } from "@/components/empty-states"

export function JournalTabContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { filteredTrades, dateRangeLabel, isLoading } = useFilteredTrades()
  const { resetFilters, isDefault } = useFilters()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNewEntry = () => {
    setEditingEntry(null)
    setIsModalOpen(true)
  }

  const handleEditEntry = (id: string) => {
    setEditingEntry(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEntry(null)
  }

  // Handle empty states
  if (!isLoading && isClient && filteredTrades.length === 0) {
    if (isDefault) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Trading Journal</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Track and analyze your trades
              </p>
            </div>
            <Button onClick={handleNewEntry} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
          <NoTradesState />
        </div>
      )
    }
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Trading Journal</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Track and analyze your trades
            </p>
          </div>
          <Button onClick={handleNewEntry} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
        <NoFilterResultsState onClearFilters={resetFilters} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Journal Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Trading Journal</h2>
          <p className="text-muted-foreground text-sm mt-1" suppressHydrationWarning>
            Track and analyze your trades • {dateRangeLabel} • {isClient ? filteredTrades.length : '-'} trades
          </p>
        </div>
        <Button onClick={handleNewEntry} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Journal Table */}
      <JournalTable onEditEntry={handleEditEntry} />

      {/* Entry Modal */}
      <JournalEntryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        editingEntryId={editingEntry}
      />
    </div>
  )
}
