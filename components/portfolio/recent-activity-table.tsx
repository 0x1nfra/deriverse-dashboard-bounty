import { cn } from "@/lib/utils"

// Mock activity data matching the mockup
const recentActivity = [
  { type: "BUY", asset: "SOL", secondaryAsset: "BTC", amount: 2.5, secondaryAmount: 2.5, time: "10:30 AM" },
  { type: "SELL", asset: "SOL", secondaryAsset: "ETH", amount: 0.1, secondaryAmount: 0.1, time: "10:30 AM" },
  { type: "SELL", asset: "BTC", secondaryAsset: "BTC", amount: 0.1, secondaryAmount: 56.45, time: "10:50 AM" },
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
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Secondary</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentActivity.map((activity, idx) => (
              <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3">
                  <span className={cn(
                    "text-sm font-medium",
                    activity.type === "BUY" ? "text-success" : "text-destructive"
                  )}>
                    {activity.type}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "text-sm font-medium",
                    activity.type === "BUY" ? "text-success" : "text-destructive"
                  )}>
                    {activity.asset}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-mono text-foreground">
                  {activity.secondaryAsset}
                </td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">
                  {activity.amount}
                </td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">
                  {activity.secondaryAmount}
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
