"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useFilteredTrades } from "@/hooks/use-filtered-trades"
import { formatCurrency } from "@/lib/mock/trades"
import { AnnotationIcon } from "@/components/annotations/annotation-icon"
import { AnnotationCell } from "@/components/annotations/annotation-cell"

// Secondary tabs for history section (matching reference images)
const historyTabs = ["Trade History", "Deposits", "Withdrawals", "Transfers"]

// Mock deposit/withdrawal data
const transactionHistory = [
  { id: "1", date: "2024-01-20", type: "Deposit", asset: "USDC", amount: "$10,000.00", status: "Completed", txHash: "0x1234...abcd" },
  { id: "2", date: "2024-01-15", type: "Withdrawal", asset: "USDC", amount: "$2,500.00", status: "Completed", txHash: "0x5678...efgh" },
  { id: "3", date: "2024-01-10", type: "Deposit", asset: "SOL", amount: "50.00", status: "Completed", txHash: "0x9abc...ijkl" },
]

export function HistoryTabContent() {
  const [activeHistoryTab, setActiveHistoryTab] = useState("Trade History")
  const { filteredTrades, dateRangeLabel } = useFilteredTrades()

  return (
    <div className="space-y-6">
      {/* History Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
          <p className="text-muted-foreground text-sm mt-1">
            View all your trading and account activity • {dateRangeLabel} • {filteredTrades.length.toLocaleString()} trades
          </p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Secondary Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-border">
        {historyTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveHistoryTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeHistoryTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activeHistoryTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* History Content */}
      {activeHistoryTab === "Trade History" && <TradeHistoryTable trades={filteredTrades} />}
      {activeHistoryTab === "Deposits" && <TransactionTable type="Deposit" />}
      {activeHistoryTab === "Withdrawals" && <TransactionTable type="Withdrawal" />}
      {activeHistoryTab === "Transfers" && <TransfersTable />}
    </div>
  )
}

interface TradeHistoryTableProps {
  trades: ReturnType<typeof useFilteredTrades>['filteredTrades']
}

// Trade History Table
function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-8 text-center text-muted-foreground">
          No trades found for the selected filters
        </div>
      </div>
    )
  }

  // Sort trades by timestamp (newest first)
  const sortedTrades = [...trades].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const handleRowClick = (tradeId: string) => {
    setExpandedRow(expandedRow === tradeId ? null : tradeId)
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Symbol</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Side</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Entry Price</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PnL</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Fees</th>
              <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrades.map((trade) => {
              const totalFees = trade.fees.maker + trade.fees.taker + trade.fees.funding
              const isExpanded = expandedRow === trade.id
              
              return (
                <>
                  <tr 
                    key={trade.id} 
                    className={cn(
                      "hover:bg-secondary/30 transition-colors cursor-pointer",
                      isExpanded && "bg-secondary/20"
                    )}
                    onClick={() => handleRowClick(trade.id)}
                  >
                    <td className="px-5 py-3 text-sm text-muted-foreground">
                      {trade.timestamp.toLocaleDateString()} {trade.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-foreground font-mono">{trade.symbol}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold",
                        trade.side === "long" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      )}>
                        {trade.side === "long" ? "Long" : "Short"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{trade.size.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{formatCurrency(trade.entryPrice)}</td>
                    <td className={cn(
                      "px-5 py-3 text-sm font-mono",
                      trade.pnl >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                    </td>
                    <td className="px-5 py-3 text-sm font-mono text-muted-foreground text-right">{formatCurrency(totalFees)}</td>
                    <td className="px-5 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <AnnotationIcon 
                        tradeId={trade.id} 
                        onClick={() => handleRowClick(trade.id)}
                      />
                    </td>
                  </tr>
                  <AnnotationCell 
                    tradeId={trade.id}
                    isExpanded={isExpanded}
                    onToggle={() => handleRowClick(trade.id)}
                  />
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Transaction Table for Deposits/Withdrawals
function TransactionTable({ type }: { type: "Deposit" | "Withdrawal" }) {
  const filteredTransactions = transactionHistory.filter(t => t.type === type)
  
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">TX Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-sm text-muted-foreground">{tx.date}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{tx.asset}</td>
                  <td className="px-5 py-3 text-sm font-mono text-foreground">{tx.amount}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-success/20 text-success">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground text-right">{tx.txHash}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  No {type.toLowerCase()}s found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Transfers Table
function TransfersTable() {
  const transfers = [
    { id: "1", date: "2024-01-18", from: "Spot", to: "Perps", asset: "USDC", amount: "$5,000.00" },
    { id: "2", date: "2024-01-12", from: "Perps", to: "Spot", asset: "USDC", amount: "$2,000.00" },
  ]

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">From</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">To</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transfers.map((transfer) => (
              <tr key={transfer.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 text-sm text-muted-foreground">{transfer.date}</td>
                <td className="px-5 py-3 text-sm text-foreground">{transfer.from}</td>
                <td className="px-5 py-3 text-sm text-foreground">{transfer.to}</td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">{transfer.asset}</td>
                <td className="px-5 py-3 text-sm font-mono text-foreground text-right">{transfer.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
