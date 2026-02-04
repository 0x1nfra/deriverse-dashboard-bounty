"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// Secondary tabs for history section (matching reference images)
const historyTabs = ["Trade History", "Deposits", "Withdrawals", "Transfers"]

// Mock trade history data
const tradeHistory = [
  { id: "1", date: "2024-01-26 14:32", pair: "SOL/USD", type: "Buy", amount: "50", price: "98.50", total: "$4,925.00", fee: "$2.46" },
  { id: "2", date: "2024-01-26 10:15", pair: "BTC/USD", type: "Sell", amount: "0.1", price: "49,200", total: "$4,920.00", fee: "$2.46" },
  { id: "3", date: "2024-01-25 16:45", pair: "ETH/USD", type: "Buy", amount: "2.0", price: "2,450", total: "$4,900.00", fee: "$2.45" },
  { id: "4", date: "2024-01-25 09:20", pair: "SOL/USD", type: "Sell", amount: "100", price: "102.30", total: "$10,230.00", fee: "$5.11" },
  { id: "5", date: "2024-01-24 22:10", pair: "XRP/USD", type: "Buy", amount: "1000", price: "0.52", total: "$520.00", fee: "$0.26" },
]

// Mock deposit/withdrawal data
const transactionHistory = [
  { id: "1", date: "2024-01-20", type: "Deposit", asset: "USDC", amount: "$10,000.00", status: "Completed", txHash: "0x1234...abcd" },
  { id: "2", date: "2024-01-15", type: "Withdrawal", asset: "USDC", amount: "$2,500.00", status: "Completed", txHash: "0x5678...efgh" },
  { id: "3", date: "2024-01-10", type: "Deposit", asset: "SOL", amount: "50.00", status: "Completed", txHash: "0x9abc...ijkl" },
]

export function HistoryTabContent() {
  const [activeHistoryTab, setActiveHistoryTab] = useState("Trade History")

  return (
    <div className="space-y-6">
      {/* History Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
          <p className="text-muted-foreground text-sm mt-1">View all your trading and account activity</p>
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
      {activeHistoryTab === "Trade History" && <TradeHistoryTable />}
      {activeHistoryTab === "Deposits" && <TransactionTable type="Deposit" />}
      {activeHistoryTab === "Withdrawals" && <TransactionTable type="Withdrawal" />}
      {activeHistoryTab === "Transfers" && <TransfersTable />}
    </div>
  )
}

// Trade History Table
function TradeHistoryTable() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pair</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tradeHistory.map((trade) => (
              <tr key={trade.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 text-sm text-muted-foreground">{trade.date}</td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">{trade.pair}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold",
                    trade.type === "Buy" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  )}>
                    {trade.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{trade.amount}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${trade.price}</td>
                <td className="px-5 py-3 text-sm font-mono text-foreground">{trade.total}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground text-right">{trade.fee}</td>
              </tr>
            ))}
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
