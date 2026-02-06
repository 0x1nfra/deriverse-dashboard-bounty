"use client"

import { useState } from "react"
import { JournalTable } from "@/components/journal/journal-table"
import { JournalEntryModal } from "@/components/journal/journal-entry-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"

export function JournalTabContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const { filteredTrades, dateRangeLabel } = useFilteredTrades()

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

  return (
    <div className="space-y-6">
      {/* Journal Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Trading Journal</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Track and analyze your trades • {dateRangeLabel} • {filteredTrades.length.toLocaleString()} trades
          </p>
        </div>
        <Button onClick={handleNewEntry} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Journal Table */}
      <JournalTable onEditEntry={handleEditEntry} trades={filteredTrades} />

      {/* Entry Modal */}
      <JournalEntryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        editingEntryId={editingEntry}
      />
    </div>
  )
}
