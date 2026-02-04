import { cn } from "@/lib/utils"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string
  change?: {
    value: string
    percentage?: string
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({ label, value, change, className }: MetricCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-5",
      className
    )}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-3">
        <p className="text-2xl font-mono font-semibold text-foreground">{value}</p>
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-sm",
            change.isPositive ? "text-success" : "text-destructive"
          )}>
            {change.isPositive ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" />
            )}
            <span className="font-mono">
              {change.value}
              {change.percentage && ` (${change.percentage})`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
