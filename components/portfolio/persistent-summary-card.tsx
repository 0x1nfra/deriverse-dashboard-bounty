"use client";

import { useState, useMemo, useCallback } from "react";
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
import { TrendingUp, TrendingDown, ChevronDown, ChevronRight, BarChart3, Minus } from "lucide-react";

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
  // Number of data points per period — chosen so each point maps to a unique label
  const points =
    periodHours === 24
      ? 48        // 30-min intervals
      : periodHours === 168
        ? 7       // 1 per day
        : periodHours === 720
          ? 30    // 1 per day
          : periodHours === 8760
            ? 52  // 1 per week
            : 365; // 1 per day
  const now = new Date();

  // Generate realistic looking portfolio value data
  let currentValue = baseValue;
  for (let i = points; i >= 0; i--) {
    // Time step per point — matches point count to cover the full period
    const timeOffset =
      periodHours === 24
        ? i * 30 * 60 * 1000               // 30 min
        : periodHours === 168
          ? i * 24 * 60 * 60 * 1000        // 1 day
          : periodHours === 720
            ? i * 24 * 60 * 60 * 1000      // 1 day
            : periodHours === 8760
              ? i * 7 * 24 * 60 * 60 * 1000  // 1 week
              : i * 24 * 60 * 60 * 1000;     // 1 day

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
                day: "numeric",
              })
            : date.toLocaleDateString([], { month: "short", day: "numeric" }),
      timestamp: date.getTime(),
      value: currentValue,
      pnl: pnlValue, // Profit/loss value
      isPositive: pnlValue >= 0,
    });
  }

  return data;
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
              isPositive ? "text-success" : "text-destructive"
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
    <div className="flex items-center justify-between py-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-mono font-medium",
          isPositive && "text-success",
          isNegative && "text-destructive",
          !isPositive && !isNegative && "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function PersistentSummaryCard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7D");
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [cardCollapsed, setCardCollapsed] = useState(false);

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

  // Primary metrics always shown on mobile
  const primaryMetrics = (
    <>
      <MetricRow
        label="PnL"
        value={`${metrics.pnl.isPositive ? "+" : ""}$${metrics.pnl.value.toLocaleString(
          undefined,
          { minimumFractionDigits: 2 }
        )}`}
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
    </>
  );

  // Extra metrics hidden by default on mobile
  const extraMetrics = (
    <>
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
      <MetricRow
        label="Win Rate"
        value={`${metrics.winRate.value}% (${metrics.winRate.trades})`}
      />
      <MetricRow
        label="Sharpe Ratio"
        value={metrics.sharpeRatio.toFixed(2)}
      />
    </>
  );

  const chartSection = (
    <div className="p-3 bg-gradient-to-br from-transparent to-muted/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-foreground">Portfolio Value</h3>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {timePeriods.map((period) => (
            <button
              key={period.label}
              onClick={() => setSelectedPeriod(period.label)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer",
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

      <div className="h-[220px] -mx-2">
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
                interval={Math.max(Math.floor(chartData.length / 8) - 1, 0)}
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
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Mobile collapse header - only visible on small screens */}
      <div className="flex items-center justify-between px-3 py-2 lg:hidden border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Portfolio Summary</span>
        <button
          onClick={() => setCardCollapsed(!cardCollapsed)}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] text-muted-foreground transition-colors cursor-pointer"
        >
          {cardCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Card content - collapsible on mobile */}
      <div className={cn(cardCollapsed && "hidden lg:block")}>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
          {/* Left Side - Metrics Panel */}
          <div className="p-3 lg:border-r border-border">
            {/* Primary Metric - Account Value */}
            <div className="mb-1">
              <span className="text-xs text-muted-foreground">Account Value</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[24px] font-bold font-mono text-foreground leading-tight">
                  $
                  {accountMetrics.accountValue.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium font-mono px-1.5 py-0.5 rounded",
                    accountMetrics.accountValue.isPositive
                      ? "text-success bg-success/10"
                      : "text-destructive bg-destructive/10"
                  )}
                >
                  {accountMetrics.accountValue.isPositive ? "+" : ""}
                  {accountMetrics.accountValue.changePercent}%
                </span>
              </div>
            </div>

            {/* Metrics list */}
            <div className="space-y-0.5">
              {primaryMetrics}

              {/* Extra metrics: always visible on desktop, toggle on mobile */}
              <div className="hidden lg:block">
                {extraMetrics}
              </div>

              {/* Mobile: collapsible extra metrics */}
              <div className="lg:hidden">
                {showAllMetrics && extraMetrics}
                <button
                  onClick={() => setShowAllMetrics(!showAllMetrics)}
                  className="w-full mt-2 py-1.5 text-[11px] font-medium text-primary/80 hover:text-primary bg-primary/[0.05] hover:bg-primary/[0.1] border border-primary/20 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {showAllMetrics ? "Show Less" : "Show More"}
                  <ChevronDown className={cn("h-3 w-3 transition-transform", showAllMetrics && "rotate-180")} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Chart */}
          {/* Desktop: always visible */}
          <div className="hidden lg:block">
            {chartSection}
          </div>

          {/* Mobile: collapsible chart */}
          <div className="lg:hidden border-t border-border">
            {showChart ? (
              <>
                <button
                  onClick={() => setShowChart(false)}
                  className="w-full px-3 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BarChart3 className="h-3 w-3" />
                  Hide Chart
                  <ChevronDown className="h-3 w-3 rotate-180" />
                </button>
                {chartSection}
              </>
            ) : (
              <button
                onClick={() => setShowChart(true)}
                className="w-full px-3 py-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <BarChart3 className="h-3 w-3" />
                Show Chart
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
