# Toolbar Meta Refactor — Static Routes

## Problem

The AppToolbar currently has no metadata for static routes unless they provide `toolbarMeta` via `beforeLoad`. Only `$budgetId` does this today. The remaining index pages (dashboard, expenses, ia-insights, debt-calculator) need toolbar metadata, and the pattern should be DRY.

## Solution

### Helper: `staticToolbarMeta`

Create `src/lib/toolbar.ts` with a one-liner utility:

```ts
import type { ToolbarMeta } from '@/routes/__root'

export const staticToolbarMeta = (meta: ToolbarMeta) => () => ({
  toolbarMeta: meta,
})
```

This returns a `beforeLoad`-compatible function that provides static `toolbarMeta` to the route context. Dynamic routes (like `$budgetId`) continue writing their own `beforeLoad` directly.

### Routes to Update

| Route file                       | title           | description                            | balance                                |
| -------------------------------- | --------------- | -------------------------------------- | -------------------------------------- |
| `_app/dashboard/index.tsx`       | Dashboard       | Overview of your financial health      | `{ label: 'Balance', value: '$0.00' }` |
| `_app/expenses/index.tsx`        | Expenses        | Track and manage your spending         | `{ label: 'Balance', value: '$0.00' }` |
| `_app/ia-insights/index.tsx`     | AI Insights     | Insights and spending patterns         | `{ label: 'Balance', value: '$0.00' }` |
| `_app/debt-calculator/index.tsx` | Debt Calculator | Track debts and plan payoff strategies | none                                   |

Each route adds a `beforeLoad` property using the helper:

```ts
export const Route = createFileRoute('/_app/expenses/')({
  beforeLoad: staticToolbarMeta({
    title: 'Expenses',
    description: 'Track and manage your spending',
    balance: { label: 'Balance', value: '$0.00' },
  }),
  component: RouteComponent,
})
```

### What stays unchanged

- **`$budgetId.tsx`** — keeps its own dynamic `beforeLoad` (fetches budget data, no helper needed)
- **`AppToolbar.tsx`** — already reads `toolbarMeta` from `useMatches()`, no changes
- **`NAVIGATION_ITEMS`** — remains for sidebar navigation, unrelated to toolbar
- **`ToolbarMeta` type** — no changes needed

## Future Considerations

Dashboard and expenses will eventually become dynamic when the multi-budget refactor happens (scoping data to a selected budget). At that point, those routes will replace `staticToolbarMeta` with a custom `beforeLoad` that fetches the selected budget — same pattern as `$budgetId`.

## Files Changed

1. **New:** `src/lib/toolbar.ts` — helper function
2. **Modified:** `src/routes/_app/dashboard/index.tsx` — add `beforeLoad`
3. **Modified:** `src/routes/_app/expenses/index.tsx` — add `beforeLoad`
4. **Modified:** `src/routes/_app/ia-insights/index.tsx` — add `beforeLoad`
5. **Modified:** `src/routes/_app/debt-calculator/index.tsx` — add `beforeLoad`
