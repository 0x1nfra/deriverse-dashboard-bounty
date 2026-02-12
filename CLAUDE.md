# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Next.js 16, default port 3000)
pnpm build        # Production build
pnpm lint         # ESLint
```

No test runner is configured.

## Architecture

Next.js 16 App Router trading dashboard using React 19, TypeScript, Tailwind CSS v4, shadcn/ui, and Recharts. Dark theme only (hardcoded `className="dark"` on `<html>`).

### Single-Page Dashboard Pattern

Everything routes to `app/page.tsx` — the other route pages (`/portfolio`, `/analytics`, `/journal`) just `redirect("/")`. The main page renders a tab-based layout with 7 sub-tabs (Positions, Open Orders, History, Analytics, Journal, Volume & Fees, Risk), each with its own content component under `components/portfolio/tabs/`.

### Data Flow

- Mock trade data generated client-side (`lib/mock/trades.ts`) to avoid SSR hydration issues
- `FilterProvider` (React Context) manages global symbol + date range filters with URL persistence
- All tab components consume filtered data via `useFilteredTrades` hook
- Trade annotations use Zustand with localStorage persistence (`stores/annotation-store.ts`)

### Key Layout Components

- `PersistentSummaryCard` — top-level portfolio summary with chart + metrics (always visible above tabs)
- `GlobalFilterBar` — symbol and date range filters (between summary and tabs)
- `TopNavigation` — fixed nav header (pt-16 offset on main content)

## Code Style

- Path aliases: `@/components`, `@/lib`, `@/hooks`
- `cn()` from `@/lib/utils` for merging Tailwind classes
- CSS variables defined in `app/globals.css` — use semantic tokens (`bg-primary`, `text-muted-foreground`)
- shadcn/ui components in `components/ui/` using `class-variance-authority`
- Import order: React, external libs, `@/*` aliases, relative imports
- Files: kebab-case. Components: PascalCase. Hooks: `use` prefix camelCase.
- Client components require `"use client"` directive
