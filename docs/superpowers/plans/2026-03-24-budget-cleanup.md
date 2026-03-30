# Budget Cleanup Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract `usePeriodSelector` hook, fix inconsistent query key in create hook, and simplify `onEdit` signature.

**Architecture:** Three independent cleanups in the budget module. Fix 1 creates one new file and modifies two existing files. Fixes 2 and 3 are single-line edits in existing files.

**Tech Stack:** React 19, TanStack Query, react-hook-form, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-24-budget-cleanup-design.md`

---

## File Map

| File                                                   | Responsibility                           | Action                                  |
| ------------------------------------------------------ | ---------------------------------------- | --------------------------------------- |
| `src/routes/_app/budget/-hooks/use-period-selector.ts` | Period selector state + form integration | Create (Fix 1)                          |
| `src/routes/_app/budget/-hooks/use-budget-actions.ts`  | Budget CRUD actions                      | Modify — remove period selector (Fix 1) |
| `src/routes/_app/budget/-components/BudgetForm.tsx`    | Budget create/edit form                  | Modify — use new hook (Fix 1)           |
| `src/hooks/budget/use-create-budget.ts`                | Create mutation + cache invalidation     | Modify — query key (Fix 2)              |
| `src/routes/_app/budget/-hooks/use-budget-dialog.ts`   | Dialog state management                  | Modify — onEdit signature (Fix 3)       |
| `src/routes/_app/budget/index.tsx`                     | Budget route page                        | Modify — onEdit call site (Fix 3)       |

---

### Task 1: Extract `usePeriodSelector` hook (Fix 1)

**Files:**

- Create: `src/routes/_app/budget/-hooks/use-period-selector.ts`
- Modify: `src/routes/_app/budget/-hooks/use-budget-actions.ts`
- Modify: `src/routes/_app/budget/-components/BudgetForm.tsx`

- [ ] **Step 1: Create `use-period-selector.ts`**

```ts
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'

export const usePeriodSelector = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  return {
    selectedPeriod,
    handlePeriodChange:
      (form: UseFormReturn<BudgetItemFormData>) => (value: string) => {
        setSelectedPeriod(value)
        form.setValue('period', value as 'monthly' | 'yearly')
      },
  }
}
```

- [ ] **Step 2: Remove period selector from `use-budget-actions.ts`**

In `use-budget-actions.ts`, make these changes:

Remove the `useState` import (line 1) — it's only used for `selectedPeriod`:

```ts
// REMOVE: import { useState } from 'react'
```

Remove the `UseFormReturn` type import (line 3):

```ts
// REMOVE: import type { UseFormReturn } from 'react-hook-form'
```

Remove the `BudgetItemFormData` type import from the schema import (line 6) — keep only `toBudgetItemRequestBody`. Note: `BudgetItemFormData` is still used as a parameter type in `onSubmit`, so import it as a type-only import:

```ts
// KEEP the type import, just remove it from the schema import line
// The type is still needed for onSubmit parameter
```

Actually, looking more carefully: `BudgetItemFormData` is used in the `onSubmit` signature (line 22). So keep that import. Only remove `UseFormReturn`.

Remove `selectedPeriod` state (line 15):

```ts
// REMOVE: const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
```

Remove from the return object (lines 56-60, 67):

```ts
// REMOVE: handlePeriodChange: (form: UseFormReturn<BudgetItemFormData>) => (value: string) => {
//           setSelectedPeriod(value)
//           form.setValue('period', value as 'monthly' | 'yearly')
//         },
// REMOVE: selectedPeriod,
```

The final `use-budget-actions.ts` should be:

```ts
import { toast } from 'sonner'

import type { Budget } from '@/types/database.types'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'
import { toBudgetItemRequestBody } from '@/lib/schemas/budget/budget-item.schema'

import { useCreateBudget } from '@/hooks/budget/use-create-budget'
import { useDeleteBudget } from '@/hooks/budget/use-delete-budget'
import { useUpdateBudget } from '@/hooks/budget/use-update-budget'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'

export const useBudgetActions = (onSuccess: () => void) => {
  const { mutate: createBudget, isPending: isCreating } = useCreateBudget()
  const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget()
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget()
  const { data: budgets } = useBudgetOverview()

  const onSubmit = (
    data: BudgetItemFormData,
    selectedBudget: Budget | null,
  ) => {
    if (selectedBudget) {
      updateBudget(
        { ...toBudgetItemRequestBody({ ...data, id: selectedBudget.id }) },
        {
          onSuccess: () => {
            toast.success('Budget updated successfully')
            onSuccess()
          },
        },
      )
    } else {
      createBudget(toBudgetItemRequestBody(data), {
        onSuccess: () => {
          toast.success('Budget created successfully')
          onSuccess()
        },
      })
    }
  }

  const onDelete = (id: string) => {
    deleteBudget(id, {
      onSuccess: () => toast.success('Budget deleted successfully'),
    })
  }

  const getBudgets = () => {
    return budgets ?? []
  }

  return {
    getBudgets,
    isCreating,
    isDeleting,
    isUpdating,
    onDelete,
    onSubmit,
  }
}
```

- [ ] **Step 3: Update `BudgetForm.tsx` to use `usePeriodSelector`**

In `BudgetForm.tsx`, replace the import and usage:

Replace line 4:

```ts
// OLD: import { useBudgetActions } from '../-hooks/use-budget-actions'
// NEW:
import { usePeriodSelector } from '../-hooks/use-period-selector'
```

Replace line 51:

```ts
// OLD: const { handlePeriodChange, selectedPeriod } = useBudgetActions(() => {})
// NEW:
const { handlePeriodChange, selectedPeriod } = usePeriodSelector()
```

- [ ] **Step 4: Commit**

```bash
git add src/routes/_app/budget/-hooks/use-period-selector.ts src/routes/_app/budget/-hooks/use-budget-actions.ts src/routes/_app/budget/-components/BudgetForm.tsx
git commit -m "refactor: extract usePeriodSelector hook from useBudgetActions"
```

---

### Task 2: Fix `useCreateBudget` query key (Fix 2)

**Files:**

- Modify: `src/hooks/budget/use-create-budget.ts`

- [ ] **Step 1: Change query key from `.budgets()` to `.overview()`**

In `use-create-budget.ts`, line 15:

```ts
// OLD:
queryKey: useBudgetQueryKeys().budgets(),
// NEW:
queryKey: useBudgetQueryKeys().overview(),
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/budget/use-create-budget.ts
git commit -m "fix: use consistent overview() query key in useCreateBudget"
```

---

### Task 3: Simplify `onEdit` signature (Fix 3)

**Files:**

- Modify: `src/routes/_app/budget/-hooks/use-budget-dialog.ts`
- Modify: `src/routes/_app/budget/index.tsx`

- [ ] **Step 1: Simplify `onEdit` in `use-budget-dialog.ts`**

Replace lines 21-31:

```ts
// OLD:
    onEdit: (budget: BudgetOverview, budget_id: string) => {
      setSelectedBudget({
        id: budget_id,
// NEW:
    onEdit: (budget: BudgetOverview) => {
      setSelectedBudget({
        id: budget.budget_id,
```

Everything else in `onEdit` stays the same.

- [ ] **Step 2: Update call site in `index.tsx`**

Replace line 27:

```ts
// OLD:
onEdit={() => dialog.onEdit(budget, budget.budget_id)}
// NEW:
onEdit={() => dialog.onEdit(budget)}
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/budget/-hooks/use-budget-dialog.ts src/routes/_app/budget/index.tsx
git commit -m "refactor: simplify onEdit to take only BudgetOverview parameter"
```

---

### Task 4: Verify all fixes together

- [ ] **Step 1: Run type check**

Run: `npm run build`

Expected: No new TypeScript errors (pre-existing expense error is OK).

- [ ] **Step 2: Run tests**

Run: `npm run test`

Expected: All 18 tests pass.

- [ ] **Step 3: Run lint/format**

Run: `npm run check`

Expected: No lint or format issues.
