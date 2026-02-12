"use client"

import { useState, useEffect } from "react"
import { JournalTable } from "@/components/journal/journal-table"
import { JournalEntryModal } from "@/components/journal/journal-entry-modal"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { useFilters } from "@/hooks/use-filters"
import { NoTradesState, NoFilterResultsState } from "@/components/empty-states"

interface JournalTabContentProps {
  isModalOpen: boolean
  onNewEntry: () => void
  onCloseModal: () => void
}

export function JournalTabContent({ isModalOpen, onNewEntry, onCloseModal }: JournalTabContentProps) {
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { filteredTrades, isLoading } = useFilteredTrades(false)
  const { resetFilters, isDefault } = useFilters()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleEditEntry = (id: string) => {
    setEditingEntry(id)
    onNewEntry()
  }

  const handleCloseModal = () => {
    onCloseModal()
    setEditingEntry(null)
  }

  // Handle empty states
  if (!isLoading && isClient && filteredTrades.length === 0) {
    if (isDefault) {
      return (
        <div className="space-y-6">
          <NoTradesState />
        </div>
      )
    }
    return (
      <div className="space-y-6">
        <NoFilterResultsState onClearFilters={resetFilters} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
