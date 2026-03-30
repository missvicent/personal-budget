# Budget Item Card Redesign — Apple-Style Minimalist UI

**Date:** 2026-03-28
**Status:** Approved

## Goal

Refactor `BudgetItemCard` from a linear progress bar layout to a minimalist, Apple-inspired card with a circular progress ring, matching a provided reference image. Maintain light and dark mode support.

## Changes

### 1. New Reusable Component: `CircularProgress`

**Location:** `src/components/ui/circular-progress.tsx`

**Props:**

- `value: number` — progress percentage (0–100)
- `size?: number` — diameter in pixels (default: 64)
- `strokeWidth?: number` — ring thickness (default: 5)
- `color?: string` — ring fill color (CSS color string, e.g. from `category_color`)
- `trackClassName?: string` — optional class for the background track circle
- `children?: ReactNode` — content rendered inside the ring (e.g. emoji icon)
- `className?: string` — wrapper class

**Implementation:**

- SVG with two `<circle>` elements: track (background) + progress (fill)
- `stroke-dasharray` and `stroke-dashoffset` for progress arc
- Track uses `stroke: var(--color-muted)` for automatic light/dark support
- Accepts children for centering content (emoji) inside the ring via absolute positioning

### 2. Refactored `BudgetItemCard`

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│   ┌──────┐                  20%     │
│   │  💊  │              of budget   │
│   └──────┘                          │
│   (ring)                            │
│                                     │
│   Health                            │
│   $60 of $300                       │
│                                     │
└─────────────────────────────────────┘
```

- **Left column:** `CircularProgress` ring with emoji inside, category name + "$X of $Y" below
- **Right column:** Large percentage (`text-2xl font-bold`) + "of budget" (`text-xs text-muted-foreground`), vertically centered

**Styling:**

- Card: `rounded-2xl`, subtle `border-border`, minimal/no shadow
- Ring track: adapts via shadcn CSS variables
- Ring fill: uses `category_color` from `BudgetItem` data
- Percentage: `text-2xl font-bold`
- "of budget": `text-xs text-muted-foreground`
- Category name: `font-semibold`
- Amount text: `text-sm text-muted-foreground`, spent amount in `font-semibold text-foreground`
- Full light/dark support via shadcn CSS variable tokens

## Out of Scope

- No changes to types, services, hooks, or data fetching
- No new dependencies
- No changes to other components
