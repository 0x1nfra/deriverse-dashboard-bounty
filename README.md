# Deriverse Trading Analytics Dashboard

![Deriverse Dashboard](public/light.svg)

🚀 **[Live Demo](https://deriverse-dashboard-bounty.vercel.app/)** | [GitHub Repository](https://github.com/0x1nfra/deriverse-dashboard-bounty) | [Twitter/X](https://x.com/0x1nfra)

A comprehensive trading analytics solution built for Deriverse's perpetual futures trading ecosystem. Features portfolio tracking, performance analytics, risk management, and a professional trading journal in a single-page dashboard.

## Innovation Highlights

- **URL-Persisted Filters** - Multi-select symbol and date range filters with query parameter serialization for shareable dashboard states
- **Trade Annotations** - Persistent inline notes on individual trades stored in localStorage via Zustand
- **Comprehensive Risk Analytics** - Extreme trade tracking, risk:reward ratios, directional bias analysis with PnL attribution
- **Responsive Single-Page Design** - All 12 features accessible via sub-tab navigation without page reloads; optimized for mobile through desktop

## Features Implemented

Implements all core bounty requirements with focus on trader-essential analytics:

1. ✅ Total PnL tracking with visual indicators
2. ✅ Trading volume and fee analysis
3. ✅ Win rate statistics and trade count
4. ✅ Average trade duration calculations
5. ✅ Long/Short ratio analysis
6. ✅ Largest gain/loss tracking
7. ✅ Average win/loss amount analysis
8. ✅ Symbol filtering and date range selection
9. ✅ Historical PnL charts with drawdown
10. ⬜ Temporal analytics (deprioritized for comprehensive risk/journal features)
11. ✅ Trade history table with annotations
12. ✅ Fee composition breakdown
13. ✅ Order type performance analysis

### Key Components

- **Historical PnL Charts** - Equity curve with drawdown overlay
- **Risk Dashboard** - Extreme trades, win/loss analysis, directional bias
- **Trade History** - Paginated table with sorting and inline annotations
- **Volume & Fees** - Bar charts and fee composition breakdown
- **Trading Journal** - Annotated trade entries with persistence

## Tech Stack

- **Framework**: Next.js 16 with App Router & React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React

## Getting Started

```bash
# Clone and install
git clone https://github.com/0x1nfra/deriverse-dashboard-bounty
cd deriverse-dashboard-bounty
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Code Quality & Testing

Built with strict TypeScript, modular component architecture, and comprehensive error boundaries. All analytics use memoized calculations for accuracy and performance. Mock data is deterministically generated for reproducible testing.

**Security**: Client-side data generation with no external API calls; localStorage isolation; input sanitization on all user-entered annotations.

**Architecture**: Single-page dashboard with sub-tab navigation, global filter context with URL persistence, and deterministic mock data for consistent SSR/client hydration.

---

Built for the Deriverse Bounty Program
