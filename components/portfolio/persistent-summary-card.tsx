"use client";

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
import { TrendingUp, TrendingDown } from "lucide-react";

// Time period options
const timePeriods = [
  { label: "24H", hours: 24 },
  { label: "7D", hours: 168 },
  { label: "30D", hours: 720 },
  { label: "1Y", hours: 8760 },
  { label: "MAX", hours: null },
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

// Generate mock portfolio data for the chart
function generateChartData(periodHours: number | null) {
  const baseValue = 45230.89;
  const data = [];
  const points =
    periodHours === 24
      ? 24
      : periodHours === 168
        ? 168
        : periodHours === 720
          ? 30
          : periodHours === 8760
            ? 52
            : 365;
  const now = new Date();

  // Generate realistic looking portfolio value data
  let currentValue = baseValue;
  for (let i = points; i >= 0; i--) {
    const timeOffset =
      periodHours === 24
        ? i * 60 * 60 * 1000
        : periodHours === 168
          ? i * 60 * 60 * 1000
          : periodHours === 720
            ? i * 24 * 60 * 60 * 1000
            : periodHours === 8760
              ? i * 7 * 24 * 60 * 60 * 1000
              : i * 24 * 60 * 60 * 1000;

    const date = new Date(now.getTime() - timeOffset);

    // Add some random walk
    const change = (Math.random() - 0.48) * (baseValue * 0.02);
    currentValue = Math.max(currentValue + change, baseValue * 0.5);

    // Calculate profit/loss from starting value (baseValue)
    const pnlValue = currentValue - baseValue;

    data.push({
      date:
        periodHours === 24
          ? date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : periodHours === 168
            ? date.toLocaleDateString([], {
                weekday: "short",
                hour: "2-digit",
              })
            : date.toLocaleDateString([], { month: "short", day: "numeric" }),
      timestamp: date.getTime(),
      value: currentValue,
      pnl: pnlValue, // Profit/loss value
      isPositive: pnlValue >= 0,
    });
  }

  return data.reverse();
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { timestamp: number; pnl: number; isPositive: boolean };
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

interface MetricRowProps {
  label: string;
  value: string;
  isPositive?: boolean;
  isNegative?: boolean;
}

function MetricRow({ label, value, isPositive, isNegative }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-mono font-medium",
          isPositive && "text-emerald-500",
          isNegative && "text-rose-500",
          !isPositive && !isNegative && "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function MetricDivider() {
  return <hr className="h-px bg-border/50 my-2 border-0" />;
}

export function PersistentSummaryCard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7D");

  // Account metrics
  const accountMetrics = {
    accountValue: {
      value: 45230.89,
      change: 2100.5,
      changePercent: 4.86,
      isPositive: true,
    },
  };

  // Simple list metrics
  const metrics = {
    pnl: { value: 5230.89, percent: 12.3, isPositive: true },
    volume: { value: 245678.32, period: "7D" },
    maxDrawdown: { value: -22.81 },
    totalEquity: 52308.5,
    perpsEquity: 42103.92,
    spotEquity: 10204.58,
    sharpeRatio: 1.45,
    winRate: { value: 62.5, trades: "75W/45L" },
  };

  // Generate chart data based on selected period
  const chartData = useMemo(() => {
    const period = timePeriods.find((p) => p.label === selectedPeriod);
    return generateChartData(period?.hours || null);
  }, [selectedPeriod]);

  // Calculate if chart is showing positive trend
  const isChartPositive =
    chartData.length > 1 &&
    chartData[chartData.length - 1].value >= chartData[0].value;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Side - Compact Metrics Panel */}
        <div className="p-5 lg:border-r border-border">
          {/* Primary Metric - Account Value */}
          <div className="mb-3">
            <span className="text-xs text-muted-foreground">Account Value</span>
            <div className="text-[32px] font-bold font-mono text-foreground leading-tight mt-1">
              $
              {accountMetrics.accountValue.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={cn(
                  "text-sm font-mono font-medium",
                  accountMetrics.accountValue.isPositive
                    ? "text-emerald-500"
                    : "text-rose-500"
                )}
              >
                <span className="text-xs">
                  {accountMetrics.accountValue.isPositive ? "↗" : "↘"}
                </span>
                {accountMetrics.accountValue.isPositive ? "+" : ""}
                ${accountMetrics.accountValue.change.toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2 }
                )}
                ({accountMetrics.accountValue.isPositive ? "+" : ""}
                {accountMetrics.accountValue.changePercent}%)
              </span>
            </div>
          </div>

          <MetricDivider />

          {/* Core Metrics */}
          <div className="space-y-1">
            <MetricRow
              label="PnL"
              value={`${metrics.pnl.isPositive ? "+" : ""}$${metrics.pnl.value.toLocaleString(
                undefined,
                { minimumFractionDigits: 2 }
              )} (${metrics.pnl.isPositive ? "+" : ""}${metrics.pnl.percent}%)`}
              isPositive={metrics.pnl.isPositive}
            />
            <MetricRow
              label="Volume"
              value={`$${(metrics.volume.value / 1000).toFixed(1)}K`}
            />
            <MetricRow
              label="Max Drawdown"
              value={`${metrics.maxDrawdown.value}%`}
              isNegative={true}
            />
          </div>

          <MetricDivider />

          {/* Equity Breakdown */}
          <div className="space-y-1">
            <MetricRow
              label="Total Equity"
              value={`$${metrics.totalEquity.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
            />
            <MetricRow
              label="Perps Equity"
              value={`$${metrics.perpsEquity.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
            />
            <MetricRow
              label="Spot Equity"
              value={`$${metrics.spotEquity.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
            />
          </div>

          <MetricDivider />

          {/* Performance Ratios */}
          <div className="space-y-1">
            <MetricRow
              label="Sharpe Ratio"
              value={metrics.sharpeRatio.toFixed(2)}
            />
            <MetricRow
              label="Win Rate"
              value={`${metrics.winRate.value}% (${metrics.winRate.trades})`}
            />
          </div>
        </div>

        {/* Right Side - Chart with Two Colors */}
        <div className="p-6 bg-gradient-to-br from-transparent to-muted/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Portfolio Value</h3>
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

          <div className="h-[280px] -mx-2">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="persistentGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={
                          isChartPositive
                            ? "var(--success)"
                            : "var(--destructive)"
                        }
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor={
                          isChartPositive
                            ? "var(--success)"
                            : "var(--destructive)"
                        }
                        stopOpacity={0}
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
                    interval="preserveStartEnd"
                    minTickGap={30}
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
                    stroke={
                      isChartPositive ? "var(--success)" : "var(--destructive)"
                    }
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#persistentGradient)"
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
