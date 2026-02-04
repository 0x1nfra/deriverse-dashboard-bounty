# Deriverse Analytics Dashboard - Implementation Roadmap

> **Bounty Goal**: Build a comprehensive trading analytics solution with trading journal and portfolio analysis
>
> **Strategy**: Maximize bounty score through feature comprehensiveness, accuracy, clarity, and code quality

---

## 📊 Bounty Scoring Strategy

| Criteria                  | Weight | Our Focus                                  |
| ------------------------- | ------ | ------------------------------------------ |
| **Comprehensiveness**     | HIGH   | Implement 13+ features from bounty list    |
| **Accuracy**              | HIGH   | Precise calculations with 2 decimal places |
| **Clarity & Readability** | MEDIUM | Clean UI, clear visualizations             |
| **Innovation**            | MEDIUM | Go beyond basics where time permits        |
| **Code Quality**          | MEDIUM | Well-structured, documented code           |
| **Security**              | LOW    | Client-side only, basic best practices     |

---

## 🎯 Implementation Phases

### **Phase 1: Foundation & Layout** ✅ COMPLETED

_Goal: Get the skeleton built with Claude, establish component architecture_

- [x] **Task 1.1**: Project Setup

  - [x] Initialize Next.js 14 with App Router
  - [x] Install dependencies (TailwindCSS, shadcn/ui, Recharts, date-fns)
  - [x] Configure TypeScript and ESLint
  - [x] Set up folder structure (`/components`, `/lib`, `/hooks`, `/types`)
  - **Status**: ✅ Completed
  - **Assign to**: Claude
  - **Time**: 15 min

- [x] **Task 1.2**: Main Dashboard Layout

  - [x] Create unified Portfolio dashboard (single-page architecture)
  - [x] Build top navigation bar (Portfolio only - removed Trading/Analytics/Journal from global nav)
  - [x] Implement horizontal sub-tab navigation (Overview, Trading, Positions, Analytics, Journal, History)
  - [x] Add header section with stats and action buttons (Deposit/Withdraw)
  - [x] Implement responsive grid layout for widgets
  - **Status**: ✅ Completed
  - **Assign to**: Claude
  - **Time**: 30 min

- [x] **Task 1.3**: Core Atom Components
  - [x] MetricCard component (label, value, delta, trend indicator)
  - [x] Badge component (win/loss, long/short types)
  - [x] Sub-tab navigation component with conditional rendering
  - [x] Header stats bar (Account Value, Total PnL, Win Rate, Profit Factor, Sharpe Ratio)
  - **Status**: ✅ Completed
  - **Assign to**: Claude
  - **Time**: 45 min

#### **Completed Architecture:**

```
/app
  /page.tsx                    # Main Portfolio Dashboard (single-page)
  /portfolio/page.tsx          # Redirects to main page
  /journal/page.tsx            # Redirects to main page
  /analytics/page.tsx          # Redirects to main page
/components
  /portfolio/tabs/
    overview-tab.tsx           # Portfolio Value + Asset Allocation charts
    trading-tab.tsx            # Open Positions + Recent Trades + Performance
    positions-tab.tsx          # Nested tabs: Open/Closed Positions, Open Orders
    analytics-tab.tsx          # Equity Curve + Strategy Performance
    journal-tab.tsx            # Journal filters + table + entry modal
    history-tab.tsx            # Nested tabs: Trade History, Deposits, Withdrawals, Transfers
  /top-navigation.tsx          # Global nav (Portfolio only)
```

---

### **Phase 2: Core Bounty Features** 🎖️ HIGH PRIORITY - IN PROGRESS

_Goal: Implement the most impactful features that score highest_

#### **Feature Set A: PnL & Performance** (Bounty Requirements 1-3)

- [x] **Task 2.1**: Total PnL Tracking Widget

  - [x] Display total PnL with percentage change
  - [x] Add visual performance indicator (color coding)
  - [x] Calculate from mock trade data
  - [x] Show in header stats bar (visible across all tabs)
  - **Bounty Requirement**: ✅ Total PnL tracking with visual performance indicators
  - **Status**: ✅ Completed (Basic implementation in header)
  - **Assign to**: Claude
  - **Time**: 1 hour

- [x] **Task 2.2**: Win Rate Statistics

  - [x] Calculate win rate (winning trades / total closed trades)
  - [x] Display in header stats bar
  - [x] Show with visual indicator
  - **Bounty Requirement**: ✅ Win rate statistics and trade count metrics
  - **Status**: ✅ Completed (Basic implementation)
  - **Assign to**: Claude
  - **Time**: 45 min

- [ ] **Task 2.3**: Trading Volume & Fee Analysis
  - [ ] Aggregate volume across time periods (24h, 7d, 30d)
  - [ ] Display total fees paid
  - [ ] Calculate fee impact (fees as % of gross PnL)
  - [ ] Create volume comparison cards
  - **Bounty Requirement**: ✅ Complete trading volume and fee analysis
  - **Status**: ⬜ Not Started
  - **Assign to**: Claude
  - **Time**: 1 hour

#### **Feature Set B: Historical Charts** (Bounty Requirements 4-5)

- [x] **Task 2.4**: Historical PnL Chart

  - [x] Implement Recharts AreaChart for cumulative PnL (Portfolio Value Chart)
  - [x] Add date range filtering capability
  - [x] Display equity curve over time
  - [x] Add hover tooltips with date/value
  - **Bounty Requirement**: ✅ Historical PnL charts
  - **Status**: ✅ Completed
  - **Assign to**: Claude
  - **Time**: 1.5 hours

- [ ] **Task 2.5**: Drawdown Visualization
  - [ ] Calculate maximum drawdown (peak-to-trough)
  - [ ] Overlay drawdown periods on PnL chart
  - [ ] Highlight current drawdown if applicable
  - [ ] Show max drawdown percentage
  - **Bounty Requirement**: ✅ Drawdown visualization
  - **Status**: ⬜ Not Started
  - **Assign to**: You (after Claude sets up chart structure)
  - **Time**: 2 hours

#### **Feature Set C: Trade History & Filtering** (Bounty Requirements 6-8)

- [x] **Task 2.6**: Trade History Table Structure

  - [x] Implement table with columns: entry/exit price, size, PnL, duration, fees, type
  - [x] Add sorting capability
  - [x] Implement pagination
  - [x] Create History tab with nested sub-tabs (Trade History, Deposits, Withdrawals, Transfers)
  - **Bounty Requirement**: ✅ Detailed trade history table
  - **Status**: ✅ Completed
  - **Assign to**: Claude
  - **Time**: 2 hours

- [ ] **Task 2.7**: Symbol & Date Filters

  - [ ] Multi-select symbol filter with search
  - [ ] Date range selector (presets: Today, 7D, 30D, 90D, YTD, Custom)
  - [ ] Apply filters to all widgets simultaneously
  - [ ] Persist filters in URL query params
  - **Bounty Requirement**: ✅ Symbol-specific filtering and date range selection
  - **Status**: ⬜ Not Started
  - **Assign to**: Claude
  - **Time**: 1.5 hours

- [ ] **Task 2.8**: Trade Annotations
  - [ ] Add inline annotation field to table rows
  - [ ] Persist annotations in state
  - [ ] Show annotation count badge
  - [ ] Allow 500 char max per trade
  - **Bounty Requirement**: ✅ Annotation capabilities
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1 hour

---

### **Phase 3: Risk & Advanced Analytics** 🎯 MEDIUM PRIORITY

_Goal: Add sophistication and depth to analytics_

- [ ] **Task 3.1**: Largest Gain/Loss Tracking

  - [ ] Identify largest single gain with details
  - [ ] Identify largest single loss with details
  - [ ] Display symbol, timestamp, PnL amount
  - [ ] Add "view trade" link to history table
  - **Bounty Requirement**: ✅ Largest gain/loss tracking for risk management
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 45 min

- [ ] **Task 3.2**: Average Win/Loss Analysis

  - [ ] Calculate average winning trade amount
  - [ ] Calculate average losing trade amount
  - [ ] Display risk:reward ratio
  - [ ] Show distribution histogram
  - **Bounty Requirement**: ✅ Average win/loss amount analysis
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1 hour

- [ ] **Task 3.3**: Long/Short Ratio Analysis

  - [ ] Calculate long vs short position distribution
  - [ ] Show directional bias gauge
  - [ ] Track bias trend over time
  - [ ] Display PnL attribution by direction
  - **Bounty Requirement**: ✅ Long/Short ratio analysis with directional bias tracking
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1.5 hours

- [ ] **Task 3.4**: Average Trade Duration
  - [ ] Calculate average, median, min, max duration
  - [ ] Display duration distribution histogram
  - [ ] Show duration by symbol
  - [ ] Compare long vs short hold times
  - **Bounty Requirement**: ✅ Average trade duration calculations
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1 hour

---

### **Phase 4: Temporal Analytics** ⏰ MEDIUM-LOW PRIORITY

_Goal: Add time-based insights for pattern recognition_

- [ ] **Task 4.1**: Time-of-Day Performance Heatmap

  - [ ] Create 24-hour heatmap grid
  - [ ] Show PnL by hour of day
  - [ ] Apply timezone conversion from UTC
  - [ ] Color-code profit/loss intensity
  - **Bounty Requirement**: ✅ Time-of-day analysis
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 2 hours

- [ ] **Task 4.2**: Session-Based Analysis

  - [ ] Group trades by session (Asian, European, American)
  - [ ] Calculate PnL per session
  - [ ] Display session performance comparison
  - [ ] Add session filter toggle
  - **Bounty Requirement**: ✅ Session-based analysis
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1.5 hours

- [ ] **Task 4.3**: Daily Performance Metrics
  - [ ] Show daily PnL breakdown
  - [ ] Create calendar view with color coding
  - [ ] Display best/worst days
  - [ ] Track winning/losing day streaks
  - **Bounty Requirement**: ✅ Daily performance metrics
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 2 hours

---

### **Phase 5: Fee Analytics & Export** 💰 LOW PRIORITY

_Goal: Complete remaining bounty features_

- [ ] **Task 5.1**: Fee Composition Breakdown

  - [ ] Split fees by type (maker, taker, funding)
  - [ ] Create pie/donut chart visualization
  - [ ] Show percentages and absolute amounts
  - [ ] Display cumulative fee total
  - **Bounty Requirement**: ✅ Fee composition breakdown and cumulative fee tracking
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1.5 hours

- [ ] **Task 5.2**: Order Type Performance Analysis

  - [ ] Break down PnL by order type (market, limit, stop)
  - [ ] Calculate win rate per order type
  - [ ] Show average PnL per type
  - [ ] Display order type distribution
  - **Bounty Requirement**: ✅ Order type performance analysis
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1 hour

- [ ] **Task 5.3**: CSV Export Functionality
  - [ ] Implement export-to-csv library
  - [ ] Export visible table data with all columns
  - [ ] Include annotations in export
  - [ ] Add export button to FilterBar
  - **Bounty Requirement**: Exportable trade history
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 45 min

---

### **Phase 6: Polish & Optimization** ✨ FINAL PHASE

_Goal: Ensure quality, performance, and professional presentation_

- [x] **Task 6.1**: Mock Data Generation

  - [x] Create realistic dataset for positions, trades, activity
  - [x] Include variety of symbols (SOL, ETH, BTC, etc.)
  - [x] Generate trades across time periods
  - [x] Add realistic PnL distribution
  - **Status**: ✅ Completed (Basic mock data in place)
  - **Assign to**: Claude
  - **Time**: 1 hour

- [ ] **Task 6.2**: Responsive Design

  - [ ] Test at 320px (mobile)
  - [ ] Test at 768px (tablet)
  - [ ] Test at 1440px (desktop)
  - [ ] Adjust grid layouts and chart sizes
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 2 hours

- [ ] **Task 6.3**: Performance Optimization

  - [ ] Memoize expensive calculations
  - [ ] Add loading states
  - [ ] Implement virtualization for long tables
  - [ ] Optimize chart rendering (data decimation)
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 2 hours

- [ ] **Task 6.4**: Code Documentation

  - [ ] Add JSDoc comments to components
  - [ ] Document calculation formulas
  - [ ] Create README with setup instructions
  - [ ] Add inline code comments for complex logic
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1.5 hours

- [ ] **Task 6.5**: Error Handling & Edge Cases
  - [ ] Handle empty state (no trades)
  - [ ] Handle invalid date ranges
  - [ ] Add error boundaries
  - [ ] Validate calculations (no division by zero, etc.)
  - **Status**: ⬜ Not Started
  - **Assign to**: You
  - **Time**: 1 hour

---

## 📈 Progress Tracker

### Overall Completion: 5/13 Bounty Features

| Bounty Feature                               | Status | Priority |
| -------------------------------------------- | ------ | -------- |
| ✅ Total PnL tracking with visual indicators | ✅     | P0       |
| ✅ Trading volume and fee analysis           | ⬜     | P0       |
| ✅ Win rate statistics and trade count       | ✅     | P0       |
| ✅ Average trade duration                    | ⬜     | P1       |
| ✅ Long/Short ratio analysis                 | ⬜     | P1       |
| ✅ Largest gain/loss tracking                | ⬜     | P1       |
| ✅ Average win/loss amount analysis          | ⬜     | P1       |
| ✅ Symbol filtering and date range selection | ⬜     | P0       |
| ✅ Historical PnL charts with drawdown       | ✅     | P0       |
| ✅ Time-based performance metrics            | ⬜     | P2       |
| ✅ Trade history table with annotations      | ✅     | P0       |
| ✅ Fee composition breakdown                 | ⬜     | P2       |
| ✅ Order type performance analysis           | ⬜     | P2       |

**Legend**: P0 = Critical | P1 = High | P2 = Nice-to-have

---

## ⏱️ Time Estimates (Updated)

| Phase                       | Estimated Time | Status                |
| --------------------------- | -------------- | --------------------- |
| Phase 1: Foundation         | 1.5 hours      | ✅ COMPLETED          |
| Phase 2: Core Features      | 8 hours        | 🔄 IN PROGRESS (~50%) |
| Phase 3: Risk Analytics     | 4.5 hours      | ⬜ Not Started        |
| Phase 4: Temporal Analytics | 5.5 hours      | ⬜ Not Started        |
| Phase 5: Fees & Export      | 3 hours        | ⬜ Not Started        |
| Phase 6: Polish             | 7.5 hours      | 🔄 Partial (~20%)     |
| **TOTAL**                   | **~30 hours**  | **~25% Complete**     |

---

## 🎓 Claude Usage Strategy

### **Completed Tasks (Claude):**

1. ✅ Project setup and dependency configuration
2. ✅ Dashboard layout with single-page architecture
3. ✅ Core atom components (MetricCard, Badge, Stats Bar)
4. ✅ Total PnL tracking widget (in header)
5. ✅ Win rate statistics widget (in header)
6. ✅ Historical PnL chart (Portfolio Value Chart)
7. ✅ Trade history table structure
8. ✅ Sub-tab navigation system with conditional rendering
9. ✅ Asset allocation donut chart

### **Remaining Tasks for Claude:**

- [ ] Volume & fee analysis widget
- [ ] Symbol/date filter components
- [ ] Drawdown visualization overlay

### **Tasks You'll Handle:**

- Trade annotations persistence
- Risk analytics (largest gain/loss, avg win/loss, L/S ratio)
- Temporal analytics (heatmaps, sessions)
- Fee breakdown charts
- Order type analysis
- Performance optimization
- Responsive design testing
- Documentation

---

## 🚀 Recent Accomplishments

### Session: Portfolio Dashboard Refactor

**Completed:**

- Refactored entire app into single-page Portfolio dashboard
- Created 6 sub-tab components (Overview, Trading, Positions, Analytics, Journal, History)
- Updated global navigation to show only "Portfolio"
- Implemented header with key metrics (Account Value, PnL, Win Rate, Profit Factor, Sharpe Ratio)
- Added Deposit/Withdraw action buttons
- Created nested tab systems within Positions and History tabs
- Redirected legacy routes (/portfolio, /journal, /analytics) to main page

---

## 📝 Notes & Decisions

### Architecture Decisions

- **Single-Page Dashboard**: All content consolidated under Portfolio with sub-tabs (no separate routes)
- **State Management**: React useState for tab state, conditional rendering for content
- **Routing**: Main page only, legacy routes redirect to maintain backwards compatibility
- **Charts**: Recharts for all visualizations (PnL, allocation, equity curve)
- **Navigation**: Global nav simplified to Portfolio only; sub-navigation handles section switching

### Mock Data Strategy

- Generate 500-1000 trades across 90 days
- Symbols: SOL, ETH, BTC, BONK, JUP (at least 5)
- Mix of long/short, market/limit orders
- Realistic PnL distribution (60% win rate, varying sizes)
- Include all fee types (maker, taker, funding)

### Innovation Opportunities (if time permits)

- Advanced chart interactions (zoom, pan, crosshair)
- Sharpe ratio / Sortino ratio calculations
- Trade streak analysis (consecutive wins/losses)
- Symbol correlation matrix
- Custom metric builder

---

## 🎯 Submission Checklist

Before submitting to bounty:

- [x] Single-page dashboard architecture implemented
- [x] Sub-tab navigation working
- [x] Header stats visible across all tabs
- [ ] All 13 bounty features implemented (or max possible)
- [ ] Calculations verified for accuracy (2 decimal places)
- [ ] Responsive at all breakpoints
- [ ] Clean, commented code
- [ ] README with setup instructions
- [ ] GitHub repo is public
- [ ] No console errors
- [ ] Mock data is realistic
- [ ] Dashboard loads quickly (<500ms)
- [ ] Screenshots/demo video prepared

---

## 🏆 Winning Strategy Summary

**To maximize bounty score:**

1. **Comprehensiveness (35% of score)**: Implement at MINIMUM 10/13 features. Prioritize P0 features first.

2. **Accuracy (30% of score)**: All calculations must be precise. Test against manual calculations.

3. **Clarity (20% of score)**: Clean UI, intuitive navigation, clear chart labels. Use shadcn/ui for consistency.

4. **Innovation (10% of score)**: Add ONE unique feature (Sharpe ratio? Trade streak analysis?) if time permits.

5. **Code Quality (5% of score)**: Well-organized, documented code. Use TypeScript properly.

**Time allocation**: Spend 70% of time on features, 30% on polish and accuracy verification.

---

**Last Updated**: February 4, 2026
**Current Phase**: Phase 2 - Core Bounty Features (In Progress)
**Next Milestone**: Complete symbol/date filters and volume analytics
