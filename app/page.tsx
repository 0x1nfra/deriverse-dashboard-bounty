"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, Download, Upload, Info } from "lucide-react"

// Sub-tab content components
import { OverviewTabContent } from "@/components/portfolio/tabs/overview-tab"
import { TradingTabContent } from "@/components/portfolio/tabs/trading-tab"
import { AnalyticsTabContent } from "@/components/portfolio/tabs/analytics-tab"
import { JournalTabContent } from "@/components/portfolio/tabs/journal-tab"
import { PositionsTabContent } from "@/components/portfolio/tabs/positions-tab"
import { HistoryTabContent } from "@/components/portfolio/tabs/history-tab"
import { VolumeFeesTabContent } from "@/components/portfolio/tabs/volume-fees-tab"
import { RiskTabContent } from "@/components/portfolio/tabs/risk-tab"

// Filter components
import { FilterProvider } from "@/components/providers/filter-provider"
import { GlobalFilterBar } from "@/components/filters/global-filter-bar"

// Drawdown analytics
import { generatePortfolioData, calculateMaxDrawdown, calculateCurrentDrawdown, formatDrawdown } from "@/lib/analytics/drawdown"

// Sub-tabs configuration
const subTabs = [
  { id: "overview", label: "Overview" },
  { id: "trading", label: "Trading" },
  { id: "positions", label: "Positions" },
  { id: "analytics", label: "Analytics" },
  { id: "journal", label: "Journal" },
  { id: "history", label: "History" },
  { id: "volume-fees", label: "Volume & Fees" },
  { id: "risk", label: "Risk" },
]

// Portfolio summary metrics
const portfolioSummary = {
  accountValue: {
    label: "Account Value",
    value: "$45,230.89",
    change: "+$2,100.50",
    changePercent: "+4.86%",
    isPositive: true,
  },
  totalPnL: {
    label: "Total PnL",
    value: "$5,230.89",
    change: "+12.3%",
    isPositive: true,
  },
  winRate: {
    label: "Win Rate",
    value: "62.5%",
    isPositive: true,
  },
  profitFactor: {
    label: "Profit Factor",
    value: "1.8",
  },
  sharpeRatio: {
    label: "Sharpe Ratio",
    value: "1.45",
  },
}

export default function PortfolioDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Generate portfolio data and calculate drawdown metrics
  const portfolioData = useMemo(() => generatePortfolioData(), [])
  const maxDrawdown = useMemo(() => calculateMaxDrawdown(portfolioData), [portfolioData])
  const currentDrawdown = useMemo(() => calculateCurrentDrawdown(portfolioData), [portfolioData])

  // Determine which drawdown metric to show
  const drawdownLabel = currentDrawdown ? "Current Drawdown" : "Max Drawdown"
  const drawdownValue = currentDrawdown
    ? formatDrawdown(currentDrawdown.percentage)
    : maxDrawdown
      ? formatDrawdown(maxDrawdown.percentage)
      : "-0.00%"

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTabContent />
      case "trading":
        return <TradingTabContent />
      case "positions":
        return <PositionsTabContent />
      case "analytics":
        return <AnalyticsTabContent />
      case "journal":
        return <JournalTabContent />
      case "history":
        return <HistoryTabContent />
      case "volume-fees":
        return <VolumeFeesTabContent />
      case "risk":
        return <RiskTabContent />
      default:
        return <OverviewTabContent />
    }
  }

  return (
    <FilterProvider>
      <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Page Header with Title and Actions */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground mt-1">Manage and track your trading portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Withdraw
          </Button>
          <Button className="gap-2 bg-[#5471f6] hover:bg-[#5471f6]/90 text-[#000000]">
            <Upload className="h-4 w-4" />
            Deposit
          </Button>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Account Value */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span>{portfolioSummary.accountValue.label}</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="text-xl font-mono font-semibold text-foreground">
              {portfolioSummary.accountValue.value}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              {portfolioSummary.accountValue.isPositive ? (
                <ArrowUpIcon className="h-3 w-3 text-success" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 text-destructive" />
              )}
              <span className={cn(
                "text-xs font-mono",
                portfolioSummary.accountValue.isPositive ? "text-success" : "text-destructive"
              )}>
                {portfolioSummary.accountValue.change} ({portfolioSummary.accountValue.changePercent})
              </span>
            </div>
          </div>

          {/* Total PnL */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span>{portfolioSummary.totalPnL.label}</span>
              <Info className="h-3 w-3" />
            </div>
            <span className={cn(
              "text-xl font-mono font-semibold",
              portfolioSummary.totalPnL.isPositive ? "text-success" : "text-destructive"
            )}>
              {portfolioSummary.totalPnL.value}
            </span>
            <span className={cn(
              "text-xs font-mono mt-0.5",
              portfolioSummary.totalPnL.isPositive ? "text-success" : "text-destructive"
            )}>
              {portfolioSummary.totalPnL.change}
            </span>
          </div>

          {/* Win Rate */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span>{portfolioSummary.winRate.label}</span>
              <Info className="h-3 w-3" />
            </div>
            <span className={cn(
              "text-xl font-mono font-semibold",
              portfolioSummary.winRate.isPositive ? "text-success" : "text-foreground"
            )}>
              {portfolioSummary.winRate.value}
            </span>
          </div>

          {/* Profit Factor */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span>{portfolioSummary.profitFactor.label}</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="text-xl font-mono font-semibold text-foreground">
              {portfolioSummary.profitFactor.value}
            </span>
          </div>

          {/* Sharpe Ratio */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span>{portfolioSummary.sharpeRatio.label}</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="text-xl font-mono font-semibold text-foreground">
              {portfolioSummary.sharpeRatio.value}
            </span>
          </div>

          {/* Drawdown - Shows Current if in drawdown, otherwise Max */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span>{drawdownLabel}</span>
              <Info className="h-3 w-3" />
            </div>
            <span className="text-xl font-mono font-semibold text-destructive">
              {drawdownValue}
            </span>
            {currentDrawdown && maxDrawdown && (
              <span className="text-xs font-mono mt-0.5 text-muted-foreground">
                Max: {formatDrawdown(maxDrawdown.percentage)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Global Filter Bar */}
      <GlobalFilterBar />

      {/* Sub-Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex items-center gap-1">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Dynamic Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
    </FilterProvider>
  )
}
