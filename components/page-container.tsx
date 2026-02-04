import React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("max-w-[1440px] mx-auto px-6 py-8", className)}>
      {children}
    </div>
  )
}
