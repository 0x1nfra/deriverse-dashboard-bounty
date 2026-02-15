"use client"

import { useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Trade } from "@/lib/mock/trades";

interface PortfolioValueChartProps {
  trades: Trade[];
}

const timePeriods = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: 365 },
];

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "var(--primary)",
  },
};

// Format currency for display
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

interface ChartDataPoint {
  date: string;
  timestamp: number;
  value: number;
  pnl: number;
  isPositive: boolean;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.pnl >= 0;

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[180px]">
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-sm text-muted-foreground">Value:</span>
          <span className="text-base font-semibold font-mono text-foreground">
            ${payload[0].value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">PnL:</span>
          <span
            className={cn(
              "text-sm font-mono font-medium",
              isPositive ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {isPositive ? "+" : ""}
            {data.pnl.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function PortfolioValueChart({ trades }: PortfolioValueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7D");
  const startingCapital = 40000;

  // Generate portfolio data from trades
  const allData = useMemo(() => {
    if (trades.length === 0) return [];

    // Sort trades by timestamp
    const sortedTrades = [...trades].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Group trades by date and calculate cumulative PnL
    const dateMap = new Map<string, { pnl: number; date: Date }>();
    let cumulativePnl = startingCapital;

    sortedTrades.forEach((trade) => {
      const dateKey = trade.timestamp.toISOString().split("T")[0];
      cumulativePnl += trade.pnl;

      dateMap.set(dateKey, {
        pnl: cumulativePnl,
        date: trade.timestamp,
      });
    });

    // Convert to array with PnL values
    return Array.from(dateMap.entries()).map(([dateStr, { pnl }]) => ({
      date: dateStr,
      timestamp: new Date(dateStr).getTime(),
      value: pnl,
      pnl: pnl - startingCapital,
      isPositive: pnl >= startingCapital,
    }));
  }, [trades]);

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    const period = timePeriods.find((p) => p.label === selectedPeriod);
    if (!period || selectedPeriod === "ALL") return allData;

    return allData.slice(-period.days);
  }, [allData, selectedPeriod]);

  // Calculate if chart is showing positive trend
  const isChartPositive =
    filteredData.length > 1 &&
    filteredData[filteredData.length - 1].value >= filteredData[0].value;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Portfolio Value</h3>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {timePeriods.map((period) => (
            <button
              key={period.label}
              onClick={() => setSelectedPeriod(period.label)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                selectedPeriod === period.label
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="analyticsGradient"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor={isChartPositive ? "var(--success)" : "var(--destructive)"}
                    stopOpacity={0}
                  />
                  <stop
                    offset="100%"
                    stopColor={isChartPositive ? "var(--success)" : "var(--destructive)"}
                    stopOpacity={0.25}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                vertical={false}
                opacity={0.5}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                interval={Math.max(Math.floor(filteredData.length / 8) - 1, 0)}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={formatCurrency}
                domain={["auto", "auto"]}
                width={50}
              />

              <Tooltip content={<ChartTooltip />} />

              <Area
                type="monotone"
                dataKey="value"
                stroke={isChartPositive ? "var(--success)" : "var(--destructive)"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#analyticsGradient)"
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
