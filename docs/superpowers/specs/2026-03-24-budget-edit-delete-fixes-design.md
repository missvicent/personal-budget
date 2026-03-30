# Budget Edit/Delete Flow: Bug Fixes & Type Cleanup

**Date:** 2026-03-24
**Status:** Proposed
**Scope:** Budget edit/delete data flow across hooks, form, and dialog

## Context

The `ft/budget` branch adds edit and delete functionality to budget cards. The feature is partially working but has 6 issues: missing dialog state cleanup, a missing dialog-close on update, type mismatches in optimistic updates, and dead code. One earlier issue (stale update data) has already been partially fixed in the working tree.

All imports should use `@/types/database.types` (the re-export barrel) for consistency.

## Issues & Fixes

### Bug Fixes

#### 1. Already fixed: Update data flow (`use-budget-actions.ts`)

**Status:** Already resolved in working tree. Line 27 now reads:

```ts
toBudgetItemRequestBody({ ...data, id: selectedBudget.id })
```

This correctly uses form `data` and attaches `id` from `selectedBudget`. No further change needed.

Given this fix, the `id` field in `BudgetItemSchema` and the form reset (Fix #2) serve as defense-in-depth — `selectedBudget.id` is merged in `use-budget-actions.ts` regardless, so `id` in the form data is redundant. We keep it in the schema for clarity but it is not load-bearing.

#### 2. Form reset missing `id` field (`BudgetForm.tsx`)

**Problem:** When opening the form for edit, `form.reset()` sets `name`, `amount`, `period`, `start_date` but omits `id`. Even with fix #1, the `id` would be `undefined` in the form data.

**Fix:** Include `id: selectedBudget.id` in the `form.reset()` call.

#### 3. `selectedBudget` not cleared on dialog close (`use-budget-dialog.ts`)

**Problem:** `onOpenChange(false)` clears `selectedCategory` and `selectedPeriod` but not `selectedBudget`. After editing, clicking "New Budget" pre-fills stale data.

**Fix:** Add `setSelectedBudget(null)` in the `if (!isOpen)` block.

#### 4. Update success doesn't close dialog (`use-budget-actions.ts`)

**Problem:** The create path calls `onSuccess()` (which closes the dialog), but the update path only shows a toast.

**Fix:** Call `onSuccess()` after the toast in the update path too.

### Type Safety Fixes

#### 5. Delete optimistic update uses wrong type (`use-delete-budget.ts`)

**Problem:** The overview query cache holds `BudgetOverview[]` (field: `budget_id`), but the optimistic update types it as `Budget[]` and filters on `.id`.

**Fix:** Change types to `BudgetOverview` and filter on `budget_id`:

```ts
queryClient.setQueryData(queryKey, (old: Array<BudgetOverview>) =>
  old.filter((budget) => budget.budget_id !== id),
)
```

#### 6. Update optimistic update shape mismatch (`use-update-budget.ts`)

**Problem:** The optimistic update replaces a `BudgetOverview` entry with a raw `Budget` object. These have different field names (`budget_name` vs `name`, `budget_amount` vs `amount`).

**Fix:** Merge updated `Budget` fields into the existing `BudgetOverview` entry using `...old_budget` spread to preserve read-only fields like `total_spent`:

```ts
queryClient.setQueryData(queryKey, (old: Array<BudgetOverview>) =>
  old.map((old_budget) =>
    old_budget.budget_id === budget.id
      ? {
          ...old_budget,
          budget_name: budget.name,
          budget_amount: budget.amount,
          period: budget.period,
          start_date: budget.start_date,
          end_date: budget.end_date,
          is_active: budget.is_active,
        }
      : old_budget,
  ),
)
```

### Dead Code Cleanup

#### 7. Remove unused `selectedPeriod` from `use-budget-dialog.ts`

**Problem:** `selectedPeriod` state (typed `Budget | null`) is leftover from the deleted `use-budget.ts`. It's never read meaningfully.

**Fix:** Remove the `selectedPeriod` state, its setter, and the cleanup in `onOpenChange`.

## Files Changed

| File                                                  | Changes                          |
| ----------------------------------------------------- | -------------------------------- |
| `src/routes/_app/budget/-hooks/use-budget-actions.ts` | Fix #4 (Fix #1 already resolved) |
| `src/routes/_app/budget/-components/BudgetForm.tsx`   | Fix #2                           |
| `src/routes/_app/budget/-hooks/use-budget-dialog.ts`  | Fix #3, #7                       |
| `src/hooks/budget/use-delete-budget.ts`               | Fix #5                           |
| `src/hooks/budget/use-update-budget.ts`               | Fix #6                           |

## Testing

- Manually verify: create budget, edit budget (confirm new values persist), delete budget
- Verify dialog resets to blank form after editing then clicking "New Budget"
- Verify dialog closes after successful update
- Verify optimistic UI updates correctly for both edit and delete
