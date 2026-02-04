# AGENTS.md

Guidelines for AI agents working in this codebase.

## Project Overview

Next.js 16 trading dashboard application (Deriverse) built with React 19, TypeScript, Tailwind CSS v4, and shadcn/ui components.

## Build/Lint/Test Commands

```bash
# Development
pnpm dev              # Start dev server

# Build
pnpm build            # Production build

# Linting
pnpm lint             # Run ESLint on all files

# No test runner configured - add tests with Jest/Vitest if needed
```

## Code Style Guidelines

### TypeScript

- Use strict TypeScript mode (enabled in tsconfig.json)
- Prefer `interface` over `type` for object shapes
- Use explicit return types on exported functions
- Use `React.ComponentProps` for component prop types

### Imports

```typescript
// Order: React → External libs → Internal (@/*) → Relative
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
```

### Naming Conventions

- **Components**: PascalCase (`MetricCard`, `PerformanceChart`)
- **Hooks**: camelCase starting with `use` (`useToast`, `useMobile`)
- **Utils**: camelCase (`cn`, `formatDate`)
- **Files**: kebab-case (`performance-chart.tsx`, `use-toast.ts`)
- **Types/Interfaces**: PascalCase (`MetricCardProps`, `ChartConfig`)

### Component Structure

```typescript
"use client" // If needed (hooks, browser APIs)

import * as React from 'react'
// ... other imports

interface ComponentProps {
  // Props here
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    // JSX
  )
}
```

### Styling (Tailwind CSS v4)

- Use CSS variables from `globals.css` for colors
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow existing patterns in `components/ui/*`
- Use semantic color names: `bg-primary`, `text-muted-foreground`

### Error Handling

- Use early returns for guard clauses
- Handle async errors with try/catch
- Use React error boundaries for component errors
- Log errors appropriately for debugging

### File Organization

```
app/              # Next.js app router pages
components/       # React components
  ui/            # shadcn/ui components
  dashboard/     # Dashboard-specific components
  analytics/     # Analytics-specific components
  portfolio/     # Portfolio-specific components
  journal/       # Journal-specific components
hooks/           # Custom React hooks
lib/             # Utility functions
styles/          # Global styles
public/          # Static assets
```

### shadcn/ui Patterns

- Use `class-variance-authority` for component variants
- Export both component and variant type
- Use `Slot` from Radix for `asChild` prop support
- Follow existing component patterns in `components/ui/`

### Path Aliases

Use `@/*` aliases as defined in `components.json`:
- `@/components/*` → `components/*`
- `@/lib/*` → `lib/*`
- `@/hooks/*` → `hooks/*`

### Git

- NEVER commit unless explicitly asked
- NEVER run git commands with `-i` flag
- Check git status before making changes

## Architecture Notes

- Next.js App Router with React Server Components by default
- Client components use `"use client"` directive
- Dark theme only (defined in `globals.css`)
- Uses Radix UI primitives via shadcn/ui
- Charts use Recharts library
