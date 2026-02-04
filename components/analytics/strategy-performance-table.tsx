import { cn } from "@/lib/utils"

// Mock strategy performance data matching the mockup
const strategyData = [
  {
    strategy: "Breakout",
    trades: 125,
    winningTrades: 125,
    winRate: 80,
    pnl: 4800,
    pnlPositive: true,
    avgReturn: "+$15,200",
    avgReturnPositive: true,
  },
  {
    strategy: "Momentum",
    subStrategy: "Mean Revert",
    trades: 88,
    winningTrades: 55,
    winRate: 40,
    pnl: -1100,
    pnlPositive: false,
    avgReturn: "5.1%",
    avgReturnPositive: true,
  },
  {
    strategy: "Scalping",
    trades: 210,
    winningTrades: 147,
    winRate: 70,
    pnl: -9500,
    pnlPositive: false,
    avgReturn: "4.5%",
    avgReturnPositive: true,
  },
]

export function StrategyPerformanceTable() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Strategy Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Strategy
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Trades
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Winning
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Win Rate
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                P&L
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Avg Return
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {strategyData.map((item, idx) => (
              <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3">
                  <span className="text-sm font-medium text-foreground">{item.strategy}</span>
                  {item.subStrategy && (
                    <span className="text-sm text-muted-foreground ml-2">{item.subStrategy}</span>
                  )}
                </td>
                <td className="px-5 py-3 text-sm font-mono text-foreground">
                  {item.trades}
                </td>
                <td className={cn(
                  "px-5 py-3 text-sm font-mono",
                  item.winningTrades > item.trades * 0.5 ? "text-success" : "text-destructive"
                )}>
                  {item.winningTrades}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {/* Win rate bar */}
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          item.winRate >= 50 ? "bg-success" : "bg-destructive"
                        )}
                        style={{ width: `${item.winRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-foreground">{item.winRate}%</span>
                  </div>
                </td>
                <td className={cn(
                  "px-5 py-3 text-sm font-mono",
                  item.pnlPositive ? "text-success" : "text-destructive"
                )}>
                  {item.pnlPositive ? "+" : ""}${Math.abs(item.pnl).toLocaleString()}
                </td>
                <td className={cn(
                  "px-5 py-3 text-sm font-mono text-right",
                  item.avgReturnPositive ? "text-success" : "text-destructive"
                )}>
                  {item.avgReturn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
