"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { JournalTable } from "@/components/journal/journal-table"
import { JournalFilters } from "@/components/journal/journal-filters"
import { JournalEntryModal } from "@/components/journal/journal-entry-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function JournalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)

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
    <PageContainer>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Trading Journal</h1>
          <p className="text-muted-foreground mt-1">Track and analyze your trades</p>
        </div>
        <Button onClick={handleNewEntry} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Filters */}
      <JournalFilters />

      {/* Journal Table */}
      <JournalTable onEditEntry={handleEditEntry} />

      {/* Entry Modal */}
      <JournalEntryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        editingEntryId={editingEntry}
      />
    </PageContainer>
  )
}
