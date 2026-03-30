# Sidebar Refactor & Overview Page

**Date:** 2026-03-28
**Status:** Approved

## Summary

Refactor the app sidebar from a flat navigation list to a budget-centric structure with two groups (GENERAL and MY BUDGETS), restructure routes to nest under individual budgets, and add a static Overview welcome page. This reflects the app's evolution from single-budget to multi-budget.

## Sidebar Structure

The sidebar has 4 zones: header, general group, budgets group, and footer.

```
┌─────────────────────────┐
│  Header (Penly branding)│
├─────────────────────────┤
│  GENERAL                │
│    Overview     (grid)  │
│    Analytics    (chart) │
│    Debt Calc    (calc)  │
├─────────────────────────┤
│  MY BUDGETS             │
│  ● Daily Nily    35% >  │  ← collapsible
│    ├ Dashboard          │
│    ├ Expenses           │
│    └ Categories         │
│  ● Travel        30% >  │
│  ● Work          75% >  │
│                         │
│  + New budget           │
├─────────────────────────┤
│  Footer                 │
│  [Clerk avatar] [theme] │
└─────────────────────────┘
```

### GENERAL Section

- Config-driven static items using `SidebarGroup` with `SidebarGroupLabel`
- Items: Overview (`/budget/overview`), Analytics (`/ia-insights`), Debt Calculator (`/debt-calculator`)
- Each item has an icon from lucide-react

### MY BUDGETS Section

- Dynamic list from `useBudgetOverview()` hook
- Each budget renders as a shadcn `Collapsible` component
- Budget line shows: colored dot + budget name + spending percentage + chevron
- Spending percentage is `Math.round((total_spent / budget_amount) * 100)`
- When expanded, shows 3 sub-links:
  - Dashboard → `/budget/$budgetId/dashboard`
  - Expenses → `/budget/$budgetId/expenses`
  - Categories → `/budget/$budgetId/categories`
- Sub-links use `SidebarMenuSub` + `SidebarMenuSubItem` from shadcn sidebar
- "+ New budget" button at the bottom of this group, triggers existing budget creation dialog

### Footer

- Unchanged: `UserButtonWithName` + `ThemeToggle`

## Routing Changes

| Current Route       | New Route                      | Component                                                                         |
| ------------------- | ------------------------------ | --------------------------------------------------------------------------------- |
| `/dashboard`        | **Remove**                     | No longer a top-level route                                                       |
| `/expenses`         | **Remove** as top-level        | Moves under each budget                                                           |
| `/budget` (index)   | `/budget/overview`             | New static Overview component                                                     |
| `/budget/$budgetId` | `/budget/$budgetId/categories` | Existing BudgetOverview component (circular progress cards, category allocations) |
| —                   | `/budget/$budgetId/dashboard`  | Existing Dashboard page, scoped to budget                                         |
| —                   | `/budget/$budgetId/expenses`   | Existing Expenses page, filtered by `budget_id` route param                       |
| `/debt-calculator`  | **Keep**                       | Unchanged                                                                         |
| `/ia-insights`      | **Keep**                       | Unchanged                                                                         |

### Route File Changes

- Create `src/routes/_app/budget/overview.tsx` — new Overview component
- Create `src/routes/_app/budget/$budgetId/dashboard.tsx` — imports and renders existing Dashboard components, scoped to `budgetId` param
- Create `src/routes/_app/budget/$budgetId/expenses.tsx` — imports and renders existing Expenses components, filtered by `budgetId` param
- Create `src/routes/_app/budget/$budgetId/categories.tsx` — imports and renders existing BudgetOverview component (moved from `$budgetId.tsx`)
- Convert `src/routes/_app/budget/$budgetId.tsx` to a layout route with `<Outlet />` for nested routes, or remove if TanStack Router handles this via directory convention
- Remove `src/routes/_app/dashboard/` directory (components no longer referenced as a standalone route)
- Remove `src/routes/_app/expenses/index.tsx` as a top-level route — keep the `-components/` and `-hooks/` directories in place since the new route files import from them
- Default redirect: `/budget` index route redirects to `/budget/overview`

## Overview Component

Static welcome/guide page at `/budget/overview`.

### Layout (top to bottom)

1. **Header badge**: "Welcome to Personal Budget" pill/badge at the top center
2. **Hero section**: Star icon in a rounded purple container, heading "One place for every budget", subtitle: "Create monthly budgets, yearly goals, savings targets, travel funds — each gets its own dashboard, expense list, and categories."
3. **Feature cards**: 2x2 responsive grid (stacks to 1 column on mobile):
   - **Per-budget dashboard** (bar chart emoji) — "KPIs and charts scoped to exactly one budget at a time"
   - **Scoped expenses** (clipboard emoji) — "Expenses live inside their budget — no global list"
   - **Custom categories** (folder emoji) — "Each budget has its own category list and spend limits"
   - **AI insights** (star emoji) — "Smart alerts before you overspend any category"
4. **CTA button**: "Create your first budget" — purple filled button, triggers existing budget creation dialog

### Styling

- Dark mode support via Tailwind `dark:` utilities
- Cards have subtle border, rounded corners, consistent with existing design language
- CTA button uses primary purple color from the app theme
- No data fetching, no hooks — pure presentational component

## Navigation Config Changes

Update `src/config/navigation.ts`:

- Remove Dashboard, Expenses, Budgets entries
- Keep only GENERAL items: Overview, Analytics (ia-insights), Debt Calculator
- Update type if needed to reflect the new structure

## Dependencies

- Add shadcn Collapsible component: `npx shadcn@latest add collapsible`

## What's NOT Included

- No new data fetching or services
- No changes to budget CRUD operations
- No sidebar collapse/icon mode for the new structure
- No drag-and-drop budget reordering
- No changes to the Debt Calculator or AI Insights pages
- No new features in Dashboard, Expenses, or Categories pages — they are relocated, not modified
