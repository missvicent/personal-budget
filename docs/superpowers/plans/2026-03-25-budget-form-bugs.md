# Budget Form Bugs Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two bugs: period selector showing wrong value on edit, and end_date recalculating on every save.

**Architecture:** Eliminate dual state in period selector by making react-hook-form the single source of truth. Stop sending `end_date` on updates unless `start_date` changed — the backend already calculates it.

**Tech Stack:** React 19, react-hook-form, zod, Vitest

---

### Task 1: Fix period selector dual state

**Root cause:** `usePeriodSelector` maintains its own `useState` separate from react-hook-form. When the form resets on edit, the hook's state stays `null`, and `BudgetForm` falls back to `'monthly'` via `selectedPeriod ?? 'monthly'` — displaying the wrong period while the form holds the real value.

**Files:**

- Delete: `src/routes/_app/budget/-hooks/use-period-selector.ts`
- Modify: `src/routes/_app/budget/-components/BudgetForm.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  BudgetItemSchema,
  toBudgetItemRequestBody,
} from '../budget-item.schema'

describe('BudgetItemSchema', () => {
  it('validates a valid budget', () => {
    const result = BudgetItemSchema.safeParse({
      name: 'Monthly groceries',
      amount: 500,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = BudgetItemSchema.safeParse({
      name: '',
      amount: 500,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects zero amount', () => {
    const result = BudgetItemSchema.safeParse({
      name: 'Test',
      amount: 0,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(false)
  })

  it('defaults period to undefined when omitted', () => {
    const result = BudgetItemSchema.safeParse({
      name: 'Test',
      amount: 100,
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.period).toBeUndefined()
    }
  })
})
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm run test -- src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`
Expected: All 4 tests PASS (these validate existing schema behavior before we change anything)

- [ ] **Step 3: Delete `use-period-selector.ts`**

Delete: `src/routes/_app/budget/-hooks/use-period-selector.ts`

- [ ] **Step 4: Update `BudgetForm.tsx` to use form state directly**

Replace the full content of `BudgetForm.tsx`:

```tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PeriodSelector } from './PeriodSelector'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'
import type { Budget } from '@/types/database.types'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { BudgetItemSchema } from '@/lib/schemas/budget/budget-item.schema'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { DatePickerInput } from '@/components/shared/DatepickerInput'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const BudgetForm = ({
  isPending,
  onSubmit,
  open,
  selectedBudget,
}: {
  open: boolean
  isPending: boolean
  onSubmit: (data: BudgetItemFormData) => void
  selectedBudget: Budget | null
}) => {
  const form = useForm<BudgetItemFormData>({
    resolver: zodResolver(BudgetItemSchema),
    defaultValues: {
      period: 'monthly',
      start_date: '',
      name: '',
      amount: 0,
    },
  })

  const submitButtonText = selectedBudget ? 'Update Budget' : 'Create Budget'

  useEffect(() => {
    if (!open) return

    if (selectedBudget) {
      form.reset({
        id: selectedBudget.id,
        name: selectedBudget.name,
        amount: selectedBudget.amount,
        period: selectedBudget.period,
        start_date: selectedBudget.start_date,
      })
    } else {
      form.reset()
    }
  }, [open, form, selectedBudget])

  return (
    <Form {...form}>
      <DialogContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Set Up Your Budget</DialogTitle>
            <DialogDescription className="sr-only">
              Set Up Your Budget for a new period
            </DialogDescription>
          </DialogHeader>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Name:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount:</FormLabel>
                <FormControl>
                  <CurrencyInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Period:</FormLabel>
                <PeriodSelector
                  value={field.value ?? 'monthly'}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose a date:</FormLabel>
                <FormControl>
                  <DatePickerInput
                    id="start_date"
                    placeholder="Choose a date"
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date.toISOString())}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  The backend calculates the end date automatically from this
                  start date.
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex w-full gap-2">
            <DialogClose asChild className="w-1/3">
              <Button variant="outline" className="p-5">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-2/3 p-5" disabled={isPending}>
              {isPending ? 'Saving...' : submitButtonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Form>
  )
}
```

Key changes:

- Removed `usePeriodSelector` import and usage
- `PeriodSelector` now reads `field.value` directly from react-hook-form
- `onValueChange` is `field.onChange` — no intermediate state

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: No TypeScript errors, no import errors for deleted hook

- [ ] **Step 6: Commit**

```bash
git add -u
git commit -m "fix: remove period selector dual state, use form as single source of truth"
```

---

### Task 2: Stop recalculating end_date on updates

**Root cause:** `toBudgetItemRequestBody` always recalculates `end_date = calculatePeriod(start_date, period)`. On updates where the user didn't change `start_date`, this overwrites the existing end_date with a freshly computed one.

**Files:**

- Modify: `src/lib/schemas/budget/budget-item.schema.ts`
- Modify: `src/routes/_app/budget/-hooks/use-budget-handlers.ts`
- Modify: `src/routes/_app/budget/-components/BudgetForm.tsx` (pass dirtyFields)
- Test: `src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`

- [ ] **Step 1: Write failing tests for the new behavior**

Add to `src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  BudgetItemSchema,
  toBudgetItemRequestBody,
  toUpdateRequestBody,
} from '../budget-item.schema'

// ... existing tests ...

describe('toBudgetItemRequestBody', () => {
  it('calculates end_date for new budgets', () => {
    const result = toBudgetItemRequestBody({
      name: 'Test',
      amount: 500,
      period: 'monthly',
      start_date: '2026-03-01T00:00:00.000Z',
    })
    expect(result.end_date).toBe('2026-04-01T00:00:00.000Z')
  })

  it('calculates yearly end_date correctly', () => {
    const result = toBudgetItemRequestBody({
      name: 'Test',
      amount: 500,
      period: 'yearly',
      start_date: '2026-03-01T00:00:00.000Z',
    })
    expect(result.end_date).toBe('2027-03-01T00:00:00.000Z')
  })
})

describe('toUpdateRequestBody', () => {
  it('omits end_date when start_date is not dirty', () => {
    const result = toUpdateRequestBody(
      {
        id: '123',
        name: 'Updated name',
        amount: 500,
        period: 'monthly',
        start_date: '2026-03-01T00:00:00.000Z',
      },
      { name: true },
    )
    expect(result.end_date).toBeUndefined()
  })

  it('recalculates end_date when start_date is dirty', () => {
    const result = toUpdateRequestBody(
      {
        id: '123',
        name: 'Test',
        amount: 500,
        period: 'monthly',
        start_date: '2026-05-01T00:00:00.000Z',
      },
      { start_date: true },
    )
    expect(result.end_date).toBe('2026-06-01T00:00:00.000Z')
  })

  it('recalculates end_date when period is dirty', () => {
    const result = toUpdateRequestBody(
      {
        id: '123',
        name: 'Test',
        amount: 500,
        period: 'yearly',
        start_date: '2026-03-01T00:00:00.000Z',
      },
      { period: true },
    )
    expect(result.end_date).toBe('2027-03-01T00:00:00.000Z')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`
Expected: `toUpdateRequestBody` tests FAIL (function doesn't exist yet), `toBudgetItemRequestBody` tests PASS

- [ ] **Step 3: Add `toUpdateRequestBody` to schema file**

Modify `src/lib/schemas/budget/budget-item.schema.ts` — add after `toBudgetItemRequestBody`:

```ts
export function toUpdateRequestBody(
  data: BudgetItemFormData,
  dirtyFields: Partial<Record<keyof BudgetItemFormData, boolean>>,
): Budget {
  const { amount, period, start_date, name, is_active, id } = data
  const shouldRecalculateEndDate = dirtyFields.start_date || dirtyFields.period

  return {
    id,
    amount,
    name,
    period,
    start_date,
    end_date: shouldRecalculateEndDate
      ? calculatePeriod(new Date(start_date), period ?? 'monthly').toISOString()
      : undefined,
    is_active: is_active ?? true,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Update `BudgetForm.tsx` to pass dirtyFields on submit**

In `src/routes/_app/budget/-components/BudgetForm.tsx`, change the `onSubmit` prop type and pass dirty fields:

Change the props type:

```tsx
onSubmit: (data: BudgetItemFormData, dirtyFields: Partial<Record<keyof BudgetItemFormData, boolean>>) => void
```

Change the form submit handler:

```tsx
onSubmit={form.handleSubmit((data) =>
  onSubmit(data, form.formState.dirtyFields)
)}
```

- [ ] **Step 6: Update `use-budget-handlers.ts` to use the right transformer**

Replace `src/routes/_app/budget/-hooks/use-budget-handlers.ts`:

```ts
import { toast } from 'sonner'

import { useBudgetMutations } from './use-budget-mutations'
import type { Budget } from '@/types/database.types'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'
import {
  toBudgetItemRequestBody,
  toUpdateRequestBody,
} from '@/lib/schemas/budget/budget-item.schema'

export const useBudgetHandlers = (
  selectedBudget: Budget | null,
  onSuccess: () => void,
) => {
  const mutations = useBudgetMutations()

  const handleSubmit = (
    data: BudgetItemFormData,
    dirtyFields: Partial<Record<keyof BudgetItemFormData, boolean>>,
  ) => {
    const isUpdate = !!selectedBudget
    const body = isUpdate
      ? toUpdateRequestBody({ ...data, id: selectedBudget.id }, dirtyFields)
      : toBudgetItemRequestBody(data)
    const action = isUpdate ? mutations.update : mutations.create
    const message = isUpdate
      ? 'Budget updated successfully'
      : 'Budget created successfully'

    action(body, {
      onSuccess: () => {
        toast.success(message)
        onSuccess()
      },
    })
  }

  const handleDelete = (id: string) => {
    mutations.remove(id, {
      onSuccess: () => toast.success('Budget deleted successfully'),
    })
  }

  return {
    handleSubmit,
    handleDelete,
    isPending: mutations.isCreating || mutations.isUpdating,
  }
}
```

- [ ] **Step 7: Verify build passes**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 8: Run all tests**

Run: `npm run test`
Expected: All tests PASS

- [ ] **Step 9: Commit**

```bash
git add -u
git add src/lib/schemas/budget/__tests__/budget-item.schema.test.ts
git commit -m "fix: only recalculate end_date when start_date or period changes"
```
