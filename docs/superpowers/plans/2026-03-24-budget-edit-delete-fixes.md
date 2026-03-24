# Budget Edit/Delete Flow Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 6 issues in the budget edit/delete flow: dialog state bugs, optimistic update type mismatches, and dead code.

**Architecture:** All fixes are isolated edits to existing hooks and one form component. No new files, no structural changes. The key insight is that the query cache holds `BudgetOverview[]` (read model), so all optimistic updates must use `BudgetOverview` types and field names (`budget_id`, `budget_name`, etc.), not `Budget` (write model).

**Tech Stack:** React 19, TanStack Query (optimistic updates), react-hook-form + zod, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-24-budget-edit-delete-fixes-design.md`

---

## File Map

| File                                                  | Responsibility                          | Fixes  |
| ----------------------------------------------------- | --------------------------------------- | ------ |
| `src/routes/_app/budget/-hooks/use-budget-dialog.ts`  | Dialog open/close state, selectedBudget | #3, #7 |
| `src/routes/_app/budget/-hooks/use-budget-actions.ts` | Form submit, delete handler             | #4     |
| `src/routes/_app/budget/-components/BudgetForm.tsx`   | Budget create/edit form                 | #2     |
| `src/hooks/budget/use-delete-budget.ts`               | Delete mutation + optimistic update     | #5     |
| `src/hooks/budget/use-update-budget.ts`               | Update mutation + optimistic update     | #6     |

---

### Task 1: Fix dialog state — clear `selectedBudget` on close + remove dead `selectedPeriod` (Fixes #3, #7)

**Files:**

- Modify: `src/routes/_app/budget/-hooks/use-budget-dialog.ts`

- [ ] **Step 1: Remove `selectedPeriod` state and add `setSelectedBudget(null)` on close**

Replace the full file content with:

```ts
import { useState } from 'react'
import type { Budget, BudgetOverview, Category } from '@/types/database.types'

export const useBudgetDialog = () => {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)

  return {
    open,
    setOpen,
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        setSelectedCategory(null)
        setSelectedBudget(null)
      }
    },
    onEdit: (budget: BudgetOverview, budget_id: string) => {
      setSelectedBudget({
        id: budget_id,
        amount: budget.budget_amount,
        name: budget.budget_name,
        period: budget.period,
        start_date: budget.start_date,
        end_date: budget.end_date,
        is_active: budget.is_active,
      })
      setOpen(true)
    },
    selectedCategory,
    selectedBudget,
    setSelectedCategory,
  }
}
```

Changes from current file:

- Removed `selectedPeriod` state (line 10), its return field `selectedPeriod` and `setSelectedPeriod`
- Removed `setSelectedPeriod(null)` from `onOpenChange`
- Added `setSelectedBudget(null)` in the `if (!isOpen)` block

- [ ] **Step 2: Verify no consumers reference `selectedPeriod` from this hook**

Run: `grep -r "selectedPeriod" src/routes/_app/budget/`

Expected: No matches from `use-budget-dialog.ts` consumers (only `use-budget-actions.ts` has its own local `selectedPeriod` for the period selector, which is unrelated).

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/budget/-hooks/use-budget-dialog.ts
git commit -m "fix: clear selectedBudget on dialog close and remove dead selectedPeriod state"
```

---

### Task 2: Fix update success — close dialog after update (Fix #4)

**Files:**

- Modify: `src/routes/_app/budget/-hooks/use-budget-actions.ts`

- [ ] **Step 1: Add `onSuccess()` call in update path**

In `use-budget-actions.ts`, find the update branch (line 26-29):

```ts
updateBudget(
  { ...toBudgetItemRequestBody({ ...data, id: selectedBudget.id }) },
  { onSuccess: () => toast.success('Budget updated successfully') },
)
```

Replace with:

```ts
updateBudget(
  { ...toBudgetItemRequestBody({ ...data, id: selectedBudget.id }) },
  {
    onSuccess: () => {
      toast.success('Budget updated successfully')
      onSuccess()
    },
  },
)
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/_app/budget/-hooks/use-budget-actions.ts
git commit -m "fix: close dialog after successful budget update"
```

---

### Task 3: Fix form reset — include `id` on edit (Fix #2)

**Files:**

- Modify: `src/routes/_app/budget/-components/BudgetForm.tsx`

- [ ] **Step 1: Add `id` to the `form.reset()` call when editing**

In `BudgetForm.tsx`, find the `useEffect` (around line 57-63):

```ts
    if (selectedBudget) {
      form.reset({
        name: selectedBudget.name,
        amount: selectedBudget.amount,
        period: selectedBudget.period,
        start_date: selectedBudget.start_date,
      })
```

Replace with:

```ts
    if (selectedBudget) {
      form.reset({
        id: selectedBudget.id,
        name: selectedBudget.name,
        amount: selectedBudget.amount,
        period: selectedBudget.period,
        start_date: selectedBudget.start_date,
      })
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/_app/budget/-components/BudgetForm.tsx
git commit -m "fix: include id in form reset when editing budget"
```

---

### Task 4: Fix delete optimistic update types (Fix #5)

**Files:**

- Modify: `src/hooks/budget/use-delete-budget.ts`

- [ ] **Step 1: Change import and types to `BudgetOverview`, filter on `budget_id`**

Replace the full file content with:

```ts
import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { BudgetOverview } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()
  return useAuthMutation((id, supabase) => budgetService.delete(id, supabase), {
    onMutate: async (id: string) => {
      const queryKey = useBudgetQueryKeys().overview()
      await queryClient.cancelQueries({ queryKey })
      const previousBudgets =
        queryClient.getQueryData<Array<BudgetOverview>>(queryKey)
      queryClient.setQueryData(queryKey, (old: Array<BudgetOverview>) =>
        old.filter((budget) => budget.budget_id !== id),
      )
      return { previousBudgets, queryKey }
    },
    onSettled: (_data, error, _variables, context) => {
      if (error) {
        if (context?.previousBudgets) {
          queryClient.setQueryData(context.queryKey, context.previousBudgets)
        }
      }
      queryClient.invalidateQueries({ queryKey: context?.queryKey })
    },
  })
}
```

Changes from current file:

- Import `BudgetOverview` from `@/types/database.types` instead of `Budget` from `@/types/budget.types`
- `getQueryData<Array<BudgetOverview>>` instead of `<Array<Budget>>`
- `setQueryData` callback types: `Array<BudgetOverview>` instead of `Array<Budget>`
- Filter uses `budget.budget_id !== id` instead of `budget.id !== id`

- [ ] **Step 2: Commit**

```bash
git add src/hooks/budget/use-delete-budget.ts
git commit -m "fix: use BudgetOverview type in delete optimistic update"
```

---

### Task 5: Fix update optimistic update types (Fix #6)

**Files:**

- Modify: `src/hooks/budget/use-update-budget.ts`

- [ ] **Step 1: Fix optimistic update to merge Budget fields into BudgetOverview shape**

In `use-update-budget.ts`, find the `onMutate` handler (lines 14-24):

```ts
      onMutate: async (budget: Budget) => {
        const queryKey = useBudgetQueryKeys().overview()
        await queryClient.cancelQueries({ queryKey })
        const previousBudgets =
          queryClient.getQueryData<Array<BudgetOverview>>(queryKey)
        queryClient.setQueryData(queryKey, (old: Array<BudgetOverview>) =>
          old.map((old_budget) =>
            old_budget.budget_id === budget.id ? budget : old_budget,
          ),
        )
        return { previousBudgets, queryKey }
      },
```

Replace with:

```ts
      onMutate: async (budget: Budget) => {
        const queryKey = useBudgetQueryKeys().overview()
        await queryClient.cancelQueries({ queryKey })
        const previousBudgets =
          queryClient.getQueryData<Array<BudgetOverview>>(queryKey)
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
        return { previousBudgets, queryKey }
      },
```

Key change: Instead of replacing the entire `BudgetOverview` entry with a `Budget` object, we spread `...old_budget` to preserve read-only fields like `total_spent` and `budget_id`, then overwrite only the editable fields.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/budget/use-update-budget.ts
git commit -m "fix: map Budget fields to BudgetOverview shape in update optimistic update"
```

---

### Task 6: Verify all fixes together

- [ ] **Step 1: Run type check**

Run: `npm run build`

Expected: No TypeScript errors.

- [ ] **Step 2: Run tests**

Run: `npm run test`

Expected: All tests pass.

- [ ] **Step 3: Run lint/format**

Run: `npm run check`

Expected: No lint or format issues.
