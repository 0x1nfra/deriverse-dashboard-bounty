"use client"

import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnnotationStore } from "@/stores/annotation-store"

interface AnnotationIconProps {
  tradeId: string
  onClick?: () => void
  className?: string
}

export function AnnotationIcon({ tradeId, onClick, className }: AnnotationIconProps) {
  const hasAnnotation = useAnnotationStore((state) => state.hasAnnotation(tradeId))

  return (
    <button
      onClick={onClick}
      className={cn(
        "p-1 rounded transition-colors hover:bg-accent",
        hasAnnotation ? "text-success" : "text-muted-foreground",
        className
      )}
      title={hasAnnotation ? "View annotation" : "Add annotation"}
    >
      <FileText 
        className={cn(
          "h-4 w-4",
          hasAnnotation ? "fill-current" : ""
        )} 
      />
    </button>
  )
}
