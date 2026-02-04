import { cn } from "@/lib/utils"

// Mock data for open positions
const openPositions = [
  { pair: "BTC/USD", size: "0.5", entryPrice: "48,500", currentPrice: "49,200", pnl: "+12.0%", pnlPositive: true },
  { pair: "ETH/USD", size: "2.0", entryPrice: "2,450", currentPrice: "2,380", pnl: "-2.8%", pnlPositive: false },
  { pair: "SOL/USD", size: "50", entryPrice: "98.50", currentPrice: "102.30", pnl: "+3.9%", pnlPositive: true },
  { pair: "XRP/USD", size: "1000", entryPrice: "0.52", currentPrice: "0.48", pnl: "-7.7%", pnlPositive: false },
]

export function OpenPositionsTable() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Open Positions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pair</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Entry</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Current</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {openPositions.map((position, idx) => (
              <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-foreground">{position.pair}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{position.size}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${position.entryPrice}</td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">${position.currentPrice}</td>
                <td className={cn(
                  "px-5 py-3 text-sm font-mono text-right",
                  position.pnlPositive ? "text-success" : "text-destructive"
                )}>
                  {position.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
