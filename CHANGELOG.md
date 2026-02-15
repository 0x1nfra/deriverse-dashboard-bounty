# Changelog

## [Unreleased]

## [0.3.0] - 2025-02-15

### Added

- MIT LICENSE with proper attribution
- Social media links (Twitter/X) to README

### Changed

- Consolidated Volume & Fees tab into Analysis tab for streamlined UX
- Simplified global filters with cleaner interface
- Refined Risk tab layout and visual hierarchy
- Improved Journal tab with better annotation displays
- Enhanced History tab with refined trade table design
- Updated Positions table with clearer status indicators
- Polished Open Orders table layout
- Merged redundant analytics views for better information density
- Updated all documentation for bounty submission
- Removed deprecated tasks.md file

### Fixed

- Inconsistent datetime axis spacing on portfolio charts
- Thread synchronization issues in filter components

## [0.2.0] - 2025-02-11

### Changed

- Complete refresh of color palette with improved contrast and visual hierarchy
- Updated design system with refined cyan and purple accent colors for better data differentiation
- Restructured mock data for improved realism and consistency across components
- Refined positions table layout with better spacing, typography, and status indicators
- Enhanced journal card design with improved visual separation and annotation displays
- Optimized portfolio metric cards with clearer typography and better responsive behavior
- Updated summary dashboard layout with improved spacing and information density
- Redesigned trading tabs interface with better active state indicators and transitions
- Overall visual refinement across dashboard, analytics, and portfolio views

## [0.1.0] - 2025-02-07

### Added

- Complete trading analytics dashboard with single-page architecture
- Portfolio overview with real-time PnL tracking and win rate statistics
- Historical PnL charts with drawdown visualization
- Trading volume and fee analysis with multi-period breakdown
- Trade history table with sorting, pagination, and annotations
- Global symbol and date range filters with URL persistence
- Risk analytics (extreme trades, win/loss ratios, duration analysis)
- Order type performance analysis (market/limit/stop breakdown)
- Design system with cyan and purple accent colors
- Zustand state management for trade annotations

### Fixed

- SSR/client hydration mismatches in filter components
- Dynamic date calculations causing inconsistent renders

### Changed

- Consolidated multi-page layout into unified portfolio dashboard
- Improved chart grid transparency and visual hierarchy
- Updated color scheme for better data visualization
