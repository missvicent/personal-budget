# Budget Item SRP Refactor Design

## Context

`BudgetItem.tsx` and its surrounding hooks violate Single Responsibility Principle in several ways:

- Display logic (progress %, spending status, days left) is computed inline in the component
- `BudgetOverview -> Budget` field mapping is duplicated in `use-budget-dialog.ts` and `use-update-budget.ts`
- `use-budget-actions.ts` mixes mutation orchestration, form transformation, toast notifications, and query state
- BudgetItem (135 lines) handles badges, progress display, action buttons, and navigation in one component

This refactor cleans up SRP violations and creates reusable primitives for the upcoming budget detail page (`$budgetId.tsx`).

## Design

### 1. Centralized Budget Mapper

**File:** `src/lib/mappers/budget.ts`

Two pure functions that centralize the field-name translation between read model (`BudgetOverview`) and write model (`Budget`):

- `toBudget(overview: BudgetOverview): Budget` — converts read model to write model. Replaces manual mapping in `use-budget-dialog.ts:22-30`.
- `toBudgetOverview(budget: Budget, existing: BudgetOverview): BudgetOverview` — merges write model changes back into an existing read model entry. Replaces manual mapping in `use-update-budget.ts:19-29`.

**Consumers:**

- `use-budget-dialog.ts` calls `toBudget()` in `onEdit`
- `use-update-budget.ts` calls `toBudgetOverview()` in `onMutate` optimistic update

### 2. Display Logic Hook

**File:** `src/routes/_app/budget/-hooks/use-budget-item-display.ts`

Extracts all derived display state from BudgetItem into a reusable hook:

```ts
type BudgetItemDisplay = {
  progressValue: number
  status: SpendingStatus
  badges: Array<{ label: string; color: BadgeColor }>
  daysLeft: number
}

useBudgetItemDisplay(budget: BudgetOverview): BudgetItemDisplay
```

**Reuse:** The budget detail page (`$budgetId.tsx`) can use this hook for its header section.

**Existing utilities to reuse:**

- `getSpendingStatus()` from `src/lib/colors.ts`
- `spendingColors`, `periodColors` from `src/lib/colors.ts`
- `leftDays()` from `src/lib/dates/leftDays.ts`

### 3. Sub-Component Extraction

**Directory:** `src/routes/_app/budget/-components/budget-card/`

Extract three focused presentational components from BudgetItem:

| Component                | Props                                             | Responsibility                                |
| ------------------------ | ------------------------------------------------- | --------------------------------------------- |
| `BudgetCardBadges.tsx`   | `badges: Array<{label, color}>`                   | Renders badge list                            |
| `BudgetCardProgress.tsx` | `totalSpent, budgetAmount, progressValue, status` | Renders spent/total text + progress bar       |
| `BudgetCardActions.tsx`  | `onEdit: () => void, onDelete: () => void`        | Renders edit/delete buttons with hover reveal |

**BudgetItem.tsx** becomes a ~40-line composition:

```
Link > Card > CardHeader + CardContent(BudgetCardBadges + BudgetCardProgress + BudgetCardActions)
```

BudgetItem calls `useBudgetItemDisplay()` and passes derived values down to sub-components.

### 4. Split use-budget-actions

**Current file:** `src/routes/_app/budget/-hooks/use-budget-actions.ts` (60 lines, 4 responsibilities)

**Refactor:**

- **Rename to `use-budget-mutations.ts`** — keeps only mutation orchestration: wraps `useCreateBudget`, `useUpdateBudget`, `useDeleteBudget`. Exposes `create()`, `update()`, `remove()` and pending states. No toasts, no form transformation.
- **Toast calls** and `toBudgetItemRequestBody()` transformation move inline to `src/routes/_app/budget/index.tsx` (the call site knows what feedback to show).
- **`getBudgets()`** replaced by direct `useBudgetOverview()` call in `index.tsx`.
- **Delete `use-budget-actions.ts`** after migration.

## Files Modified

| File                                                                    | Action                                                   |
| ----------------------------------------------------------------------- | -------------------------------------------------------- |
| `src/lib/mappers/budget.ts`                                             | Create — mapper functions                                |
| `src/routes/_app/budget/-hooks/use-budget-item-display.ts`              | Create — display logic hook                              |
| `src/routes/_app/budget/-components/budget-card/BudgetCardBadges.tsx`   | Create — badge sub-component                             |
| `src/routes/_app/budget/-components/budget-card/BudgetCardProgress.tsx` | Create — progress sub-component                          |
| `src/routes/_app/budget/-components/budget-card/BudgetCardActions.tsx`  | Create — actions sub-component                           |
| `src/routes/_app/budget/-components/BudgetItem.tsx`                     | Modify — slim down to composition wrapper                |
| `src/routes/_app/budget/-hooks/use-budget-dialog.ts`                    | Modify — use `toBudget()` mapper                         |
| `src/hooks/budget/use-update-budget.ts`                                 | Modify — use `toBudgetOverview()` mapper                 |
| `src/routes/_app/budget/-hooks/use-budget-actions.ts`                   | Delete — replaced by `use-budget-mutations.ts`           |
| `src/routes/_app/budget/-hooks/use-budget-mutations.ts`                 | Create — pure mutation orchestration                     |
| `src/routes/_app/budget/index.tsx`                                      | Modify — inline toast/transform logic, direct query call |

## Verification

1. `npm run build` — no type errors
2. `npm run check` — lint/format clean
3. `npm run test` — existing tests pass
4. Manual: open budget list page, verify cards render correctly with badges, progress, and action buttons
5. Manual: create, edit, and delete a budget — verify optimistic updates and toast notifications work
6. Manual: click a budget card — verify navigation to `/budget/$budgetId` still works
