"use client"

import { useState, useCallback, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAnnotationStore } from "@/stores/annotation-store"
import { cn } from "@/lib/utils"

const MAX_ANNOTATION_LENGTH = 500

interface AnnotationCellProps {
  tradeId: string
  isExpanded: boolean
  onToggle: () => void
}

export function AnnotationCell({ tradeId, isExpanded, onToggle }: AnnotationCellProps) {
  const [text, setText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  
  const annotation = useAnnotationStore((state) => state.getAnnotation(tradeId))
  const addAnnotation = useAnnotationStore((state) => state.addAnnotation)
  const hasAnnotation = useAnnotationStore((state) => state.hasAnnotation(tradeId))

  // Sync with store when expanded
  useEffect(() => {
    if (isExpanded && annotation !== undefined) {
      setText(annotation)
    }
  }, [isExpanded, annotation])

  const handleSave = useCallback(() => {
    addAnnotation(tradeId, text)
    setIsEditing(false)
  }, [tradeId, text, addAnnotation])

  const handleCancel = useCallback(() => {
    setText(annotation || "")
    setIsEditing(false)
  }, [annotation])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value.slice(0, MAX_ANNOTATION_LENGTH)
    setText(newText)
    if (!isEditing) {
      setIsEditing(true)
    }
  }

  const charCount = text.length
  const isNearLimit = charCount > MAX_ANNOTATION_LENGTH * 0.9
  const isAtLimit = charCount >= MAX_ANNOTATION_LENGTH

  if (!isExpanded) {
    return null
  }

  return (
    <tr className="bg-secondary/20">
      <td colSpan={7} className="px-5 py-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
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
            value={text}
            onChange={handleTextChange}
            placeholder="Add notes about this trade (strategy, emotions, lessons learned...)"
            className="min-h-[100px] resize-none bg-card border-border break-words overflow-wrap-anywhere max-w-full"
          />
          
          <div className="flex items-center justify-end gap-2">
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
              disabled={!isEditing}
            >
              Save
            </Button>
          </div>
        </div>
      </td>
    </tr>
  )
}
