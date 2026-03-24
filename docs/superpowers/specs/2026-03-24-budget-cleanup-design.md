# Budget Cleanup: Extract Period Selector, Fix Query Key, Simplify onEdit

**Date:** 2026-03-24
**Status:** Proposed
**Scope:** Pre-existing cleanup items from budget edit/delete review

## Context

Three cleanup issues were identified during the code review of the budget edit/delete fixes. All are minor, isolated changes with no behavioral impact beyond removing waste.

## Fixes

### 1. Extract `usePeriodSelector` hook from `useBudgetActions`

**Problem:** `BudgetForm` instantiates `useBudgetActions(() => {})` (line 51) solely to get `handlePeriodChange` and `selectedPeriod`. This creates a redundant second instance of 3 mutation hooks (`useCreateBudget`, `useUpdateBudget`, `useDeleteBudget`) and a query hook (`useBudgetOverview`) — all unused. The no-op `() => {}` callback also means the form's copy could never close the dialog.

**Fix:**

- Create `src/routes/_app/budget/-hooks/use-period-selector.ts` with just the `selectedPeriod` state and `handlePeriodChange` function.
- `BudgetForm` imports `usePeriodSelector` instead of `useBudgetActions`.
- Remove `handlePeriodChange` and `selectedPeriod` from `useBudgetActions` return value and its internal `useState`.

### 2. `useCreateBudget` query key: `budgets()` → `overview()`

**Problem:** `use-create-budget.ts` invalidates `useBudgetQueryKeys().budgets()` (`['budgets']`), while `useUpdateBudget` and `useDeleteBudget` both use `.overview()` (`['budgets', 'overview']`). It works by accident (TanStack Query prefix matching), but is inconsistent.

**Fix:** Change line 15 of `use-create-budget.ts` from `.budgets()` to `.overview()`.

### 3. Simplify `onEdit` signature

**Problem:** `onEdit(budget: BudgetOverview, budget_id: string)` takes a redundant second parameter — `budget_id` is always `budget.budget_id` at the call site.

**Fix:**

- Change signature to `onEdit(budget: BudgetOverview)`.
- Use `budget.budget_id` internally instead of the parameter.
- Update call site in `index.tsx` from `dialog.onEdit(budget, budget.budget_id)` to `dialog.onEdit(budget)`.

## Files Changed

| File                                                   | Changes                                               |
| ------------------------------------------------------ | ----------------------------------------------------- |
| `src/routes/_app/budget/-hooks/use-period-selector.ts` | New file — extracted hook                             |
| `src/routes/_app/budget/-hooks/use-budget-actions.ts`  | Remove period selector state and return fields        |
| `src/routes/_app/budget/-components/BudgetForm.tsx`    | Use `usePeriodSelector` instead of `useBudgetActions` |
| `src/hooks/budget/use-create-budget.ts`                | `.budgets()` → `.overview()`                          |
| `src/routes/_app/budget/-hooks/use-budget-dialog.ts`   | Simplify `onEdit` signature                           |
| `src/routes/_app/budget/index.tsx`                     | Update `onEdit` call site                             |

## Testing

- Run `npm run build` — no TypeScript errors
- Run `npm run test` — all tests pass
- Run `npm run check` — no lint/format issues
- Manually verify: create, edit, and delete budgets still work; period selector works in form
