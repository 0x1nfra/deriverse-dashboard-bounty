"use client"

import { useState, useCallback } from "react"
import { FileText, Pencil, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAnnotationStore, MAX_ANNOTATION_LENGTH } from "@/stores/annotation-store"
import { cn } from "@/lib/utils"

interface AnnotationDisplayProps {
  tradeId: string
}

export function AnnotationDisplay({ tradeId }: AnnotationDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState("")

  const annotation = useAnnotationStore((state) => state.getAnnotation(tradeId))
  const addAnnotation = useAnnotationStore((state) => state.addAnnotation)
  const removeAnnotation = useAnnotationStore((state) => state.removeAnnotation)
  const hasAnnotation = useAnnotationStore((state) => state.hasAnnotation(tradeId))

  const handleEdit = useCallback(() => {
    setEditText(annotation || "")
    setIsEditing(true)
  }, [annotation])

  const handleSave = useCallback(() => {
    addAnnotation(tradeId, editText)
    setIsEditing(false)
  }, [tradeId, editText, addAnnotation])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditText("")
  }, [])

  const handleDelete = useCallback(() => {
    removeAnnotation(tradeId)
    setIsEditing(false)
    setEditText("")
  }, [tradeId, removeAnnotation])

  const charCount = editText.length
  const isNearLimit = charCount > MAX_ANNOTATION_LENGTH * 0.9
  const isAtLimit = charCount >= MAX_ANNOTATION_LENGTH

  // Edit mode
  if (isEditing) {
    return (
      <div className="space-y-3 p-4 bg-secondary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Trade Notes
          </span>
          <span className={cn(
            "text-xs",
            isAtLimit ? "text-destructive" : isNearLimit ? "text-yellow-500" : "text-muted-foreground"
          )}>
            {charCount}/{MAX_ANNOTATION_LENGTH}
          </span>
        </div>

        <Textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value.slice(0, MAX_ANNOTATION_LENGTH))}
          placeholder="Add notes about this trade..."
          className="min-h-[120px] resize-none bg-card border-border"
          autoFocus
        />

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Read mode
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Trade Notes
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8"
        >
          <Pencil className="h-3.5 w-3.5 mr-1" />
          {hasAnnotation ? "Edit" : "Add"}
        </Button>
      </div>

      {hasAnnotation ? (
        <div className="p-3 bg-secondary/20 rounded-lg overflow-hidden">
          <p className="text-sm text-foreground whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full">{annotation}</p>
        </div>
      ) : (
        <div className="p-3 bg-secondary/10 rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground italic">
            No notes added. Click "Add" to record your thoughts on this trade.
          </p>
        </div>
      )}
    </div>
  )
}
