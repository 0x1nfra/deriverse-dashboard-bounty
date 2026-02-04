import { cn } from "@/lib/utils"

// Mock activity data
const recentActivity = [
  { type: "BUY", asset: "SOL/USD", amount: "50", value: "$4,925.00", time: "10:30 AM" },
  { type: "SELL", asset: "BTC/USD", amount: "0.1", value: "$4,920.00", time: "10:15 AM" },
  { type: "BUY", asset: "ETH/USD", amount: "2.0", value: "$4,900.00", time: "09:45 AM" },
  { type: "SELL", asset: "SOL/USD", amount: "100", value: "$10,230.00", time: "09:20 AM" },
]

export function RecentActivityTable() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentActivity.map((activity, idx) => (
              <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold",
                    activity.type === "BUY" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  )}>
                    {activity.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">
                  {activity.asset}
                </td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">
                  {activity.amount}
                </td>
                <td className="px-5 py-3 text-sm font-mono text-foreground">
                  {activity.value}
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground text-right">
                  {activity.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
