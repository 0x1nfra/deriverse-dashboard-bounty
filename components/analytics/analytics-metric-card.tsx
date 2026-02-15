import { cn } from "@/lib/utils"

interface AnalyticsMetricCardProps {
  label: string
  value: string
  subtitle?: string | null
  percentage?: number
  effectLabel?: string
  sharpe?: string
  isPositive?: boolean
}

export function AnalyticsMetricCard({
  label,
  value,
  subtitle,
  percentage,
  effectLabel,
  sharpe,
  isPositive = true,
}: AnalyticsMetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <p
          className={cn(
            "text-3xl font-mono font-bold",
            isPositive ? "text-success" : "text-destructive"
          )}
        >
          {value}
        </p>

        {/* Win rate circular indicator */}
        {percentage !== undefined && (
          <div className="relative h-8 w-8">
            <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="var(--border)"
                strokeWidth="3"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeDasharray={`${(percentage / 100) * 88} 88`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">
              {percentage}%
            </span>
          </div>
        )}

        {/* Effect label (for Profit Factor) */}
        {effectLabel && (
          <span className="text-lg font-mono text-destructive">{effectLabel}</span>
        )}

        {/* Sharpe ratio (for Max Drawdown) */}
        {sharpe && (
          <span className="text-2xl font-mono text-foreground">{sharpe}</span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  )
}
