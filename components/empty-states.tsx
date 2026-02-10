import React from "react"
import { Inbox, Filter, TrendingUp, BarChart3, Calendar, History, FileText, PieChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * Generic Empty State Component
 * Used across the dashboard for consistent empty state UI
 */
export function EmptyState({ 
  title, 
  description, 
  icon, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
        
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * No Trades Empty State
 * Shown when user has no trade history
 */
export function NoTradesState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      title="No trades found"
      description="You haven't made any trades yet. Start trading to see your analytics and performance metrics."
      icon={<TrendingUp className="h-6 w-6 text-muted-foreground" />}
      action={onClearFilters ? { label: "Clear Filters", onClick: onClearFilters } : undefined}
    />
  )
}

/**
 * No Filter Results State
 * Shown when filters return no results
 */
export function NoFilterResultsState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      title="No matching trades"
      description="No trades match your current filters. Try adjusting your symbol selection or date range."
      icon={<Filter className="h-6 w-6 text-muted-foreground" />}
      action={{ label: "Clear All Filters", onClick: onClearFilters }}
    />
  )
}

/**
 * No Data State
 * Generic empty state for charts and analytics
 */
export function NoDataState({ 
  message = "No data available" 
}: { 
  message?: string 
}) {
  return (
    <EmptyState
      title={message}
      description="There is no data to display for the selected time period."
      icon={<Inbox className="h-6 w-6 text-muted-foreground" />}
    />
  )
}

/**
 * No Chart Data State
 * Specific for chart components
 */
export function NoChartDataState() {
  return (
    <EmptyState
      title="No chart data"
      description="Not enough data points to generate a chart. Make some trades to see your performance visualization."
      icon={<BarChart3 className="h-6 w-6 text-muted-foreground" />}
    />
  )
}

/**
 * No Positions State
 * For positions tab when no open/closed positions
 */
export function NoPositionsState({ type = "open" }: { type?: "open" | "closed" | "orders" }) {
  const messages = {
    open: {
      title: "No open positions",
      description: "You don't have any active positions. Start trading to open positions."
    },
    closed: {
      title: "No closed positions",
      description: "You haven't closed any positions yet. Closed positions will appear here."
    },
    orders: {
      title: "No open orders",
      description: "You don't have any pending orders. Place orders to see them here."
    }
  }

  const msg = messages[type]

  return (
    <EmptyState
      title={msg.title}
      description={msg.description}
      icon={<PieChart className="h-6 w-6 text-muted-foreground" />}
    />
  )
}

/**
 * No Journal Entries State
 * For trading journal tab
 */
export function NoJournalEntriesState() {
  return (
    <EmptyState
      title="No journal entries"
      description="Start documenting your trades by adding notes and reflections to build your trading journal."
      icon={<FileText className="h-6 w-6 text-muted-foreground" />}
    />
  )
}

/**
 * No History State
 * For history tab
 */
export function NoHistoryState({ type }: { type: "trades" | "deposits" | "withdrawals" | "transfers" }) {
  const messages = {
    trades: {
      title: "No trade history",
      description: "Your trade history will appear here once you start trading."
    },
    deposits: {
      title: "No deposits",
      description: "Your deposit history will appear here."
    },
    withdrawals: {
      title: "No withdrawals",
      description: "Your withdrawal history will appear here."
    },
    transfers: {
      title: "No transfers",
      description: "Your transfer history will appear here."
    }
  }

  const msg = messages[type]

  return (
    <EmptyState
      title={msg.title}
      description={msg.description}
      icon={<History className="h-6 w-6 text-muted-foreground" />}
    />
  )
}

/**
 * No Analytics State
 * For analytics tab when insufficient data
 */
export function NoAnalyticsState() {
  return (
    <EmptyState
      title="Insufficient data"
      description="You need at least a few trades to generate meaningful analytics. Start trading to see your performance metrics."
      icon={<BarChart3 className="h-6 w-6 text-muted-foreground" />}
    />
  )
}
