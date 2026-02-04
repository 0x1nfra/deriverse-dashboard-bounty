# Deriverse Trading Analytics Dashboard - Product Requirements Document

## Project Overview

A comprehensive trading analytics dashboard for Deriverse's on-chain perpetual and options markets. The solution provides active traders with portfolio performance visualization, risk metrics, and detailed trade journaling capabilities through a responsive web interface.

## Objectives

- Display 13+ distinct trading metrics across PnL, risk, and temporal dimensions
- Enable sub-500ms dashboard load times through efficient data aggregation and caching
- Support filtering across 3 time granularities (daily, session-based, time-of-day) and unlimited symbol combinations
- Provide exportable trade history with annotation persistence
- Visualize drawdown periods and directional bias shifts through interactive charts

## Technical Stack

### Core Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query
- **Validation**: Zod
- **Icons**: lucide-react

### Additional Libraries

- **Recharts**: Composable chart library for PnL curves, drawdown visualization, and ratio analytics
- **date-fns**: Date manipulation for session-based grouping and timezone-aware trade duration calculations
- **@tanstack/react-table**: High-performance table for trade history with sorting, filtering, and pagination
- **export-to-csv**: Client-side CSV generation for trade history exports

## Functional Requirements

### FR-1: Performance Metrics Core

- Total PnL display with percentage change indicator and visual trend arrow
- Cumulative win rate calculation (winning trades / total closed trades) with confidence interval display
- Trade volume aggregation (24h, 7d, 30d, custom range) with fee impact subtraction
- Order type performance breakdown (market vs limit vs stop) with PnL attribution per type

### FR-2: Risk Management Analytics

- Largest single gain/loss identification with timestamp and symbol tagging
- Average win amount vs average loss amount with risk:reward ratio calculation
- Maximum drawdown visualization on historical PnL chart (peak-to-trough percentage)
- Long/Short ratio gauge with directional bias trend over selected timeframe

### FR-3: Temporal Analysis

- Trade duration distribution (average, median, range) with histogram visualization
- Time-of-day performance heatmap showing PnL by hour (local timezone)
- Session-based grouping (Asian, European, American trading sessions) with performance attribution
- Daily PnL calendar view with color-coded profit/loss intensity

### FR-4: Trade History & Journaling

- Paginated trade table displaying: entry/exit price, size, PnL, duration, fees, order type
- Inline annotation editing capability (text notes per trade, max 500 chars)
- Symbol-specific filtering with multi-select capability and search autocomplete
- Date range selector with presets (Today, 7D, 30D, 90D, YTD, Custom) and validation
- Export functionality generating CSV with all visible columns plus annotations

### FR-5: Fee Analysis

- Cumulative fee tracking with running total display
- Fee composition breakdown by type (maker, taker, funding) using pie/donut chart
- Fee impact analysis showing fees as percentage of gross PnL

## Technical Architecture

**Routing Strategy**: Single-page dashboard (`/dashboard`) with query parameter persistence for filters (`?symbols=SOL,ETH&from=2024-01-01&to=2024-02-01`). State hydration from URL on load.

**State Management**:

- Zustand stores: `tradeStore` (raw trade data), `filterStore` (active filters), `uiStore` (modal states, expanded rows)
- TanStack Query handles server state with 30s stale time and background refetching

**Data Flow**:

- Initial data ingestion via JSON mock or Solana RPC parsing (mock mode for development)
- Client-side aggregation using memoized selectors for metric calculations
- Derived state computed via Zustand selectors (win rates, averages, ratios)

**Performance**:

- Virtualized table rendering for >1000 trades
- Chart data decimation for >500 data points using LTTB algorithm (via Recharts internal optimization)
- Debounced filter updates (300ms) to prevent excessive recalculations

## Component Structure

```
Atoms
├── MetricCard (label, value, delta, indicator)
├── Badge (win/loss, long/short, order type)
└── DateRangePicker (preset buttons + custom range)

Molecules
├── PnLChart (Recharts AreaChart with drawdown overlay)
├── WinLossStats (grid of 4 stat cards)
├── FeeBreakdown (pie chart + legend)
└── TradeTableRow (collapsible with annotation field)

Organisms
├── PerformanceDashboard (metrics grid + main charts)
├── RiskAnalysisPanel (drawdown, largest loss/gain, ratios)
├── TemporalAnalysisView (heatmap, session tabs, duration stats)
├── TradeHistoryTable (TanStack Table implementation with filters)
└── FilterBar (symbol search, date range, export button)
```

## Acceptance Criteria

- **AC-1**: All 13 requested metrics calculate accurately to 2 decimal places when tested against mock dataset of 500 trades
- **AC-2**: Dashboard renders initial view within 500ms on simulated 3G connection (Lighthouse performance audit)
- **AC-3**: Date range filter updates all visualizations within 200ms without full page reload
- **AC-4**: Trade history table handles 10,000 rows without frame drops (<16ms per frame during scroll)
- **AC-5**: Long/Short ratio updates correctly when filtered to single symbol showing 100% directional accuracy
- **AC-6**: Drawdown visualization identifies correct maximum drawdown period matching manual calculation
- **AC-7**: Annotations persist in Zustand store and export to CSV column without data loss
- **AC-8**: Fee composition percentages sum to exactly 100% ±0.01% across all fee types
- **AC-9**: Responsive layout maintains functionality at 320px, 768px, and 1440px breakpoints
- **AC-10**: Time-of-day heatmap displays 24 hourly buckets with correct timezone conversion from UTC trade timestamps

## Out of Scope

- Wallet connection and authentication flows (mock wallet address only)
- Real-time WebSocket data streaming (manual refresh or polling only)
- Backend API development or database persistence (client-side state only)
- Trade execution capabilities or order placement
- Social sharing features for PnL screenshots
- Mobile-native application (web responsive only)
