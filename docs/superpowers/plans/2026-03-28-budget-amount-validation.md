# Budget Amount Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent budget item amounts from exceeding the remaining unallocated budget, with helper text showing the remaining amount.

**Architecture:** Add a `createBudgetItemSchema` factory that accepts `remainingBudget` and returns a refined Zod schema. `BudgetOverview` computes the remaining budget from the total budget and existing items, then passes it to `BudgetCategoryForm` which uses the dynamic schema and displays helper text.

**Tech Stack:** Zod, react-hook-form, TanStack Query (existing hooks)

**Spec:** `docs/superpowers/specs/2026-03-28-budget-amount-validation-design.md`

---

## File Structure

| Action | File                                                                    | Responsibility                                                      |
| ------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Modify | `src/lib/schemas/budget/budget-item.schema.ts`                          | Add `createBudgetItemSchema` factory                                |
| Create | `src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`           | Tests for dynamic schema validation                                 |
| Modify | `src/routes/_app/budget/-components/budget-item/BudgetCategoryForm.tsx` | Accept `remainingBudget` prop, use dynamic schema, show helper text |
| Modify | `src/routes/_app/budget/-components/budget-item/BudgetOverview.tsx`     | Compute remaining budget, pass to form                              |

---

### Task 1: Add `createBudgetItemSchema` factory

**Files:**

- Create: `src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`
- Modify: `src/lib/schemas/budget/budget-item.schema.ts`

- [ ] **Step 1: Write failing tests for the dynamic schema**

Create `src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { createBudgetItemSchema } from '../budget-item.schema'

const validItem = {
  category_id: 'cat-1',
  category_name: 'Groceries',
  amount: 100,
  alert_enabled: false,
}

describe('createBudgetItemSchema', () => {
  it('accepts amount equal to remaining budget', () => {
    const schema = createBudgetItemSchema(100)
    const result = schema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('accepts amount below remaining budget', () => {
    const schema = createBudgetItemSchema(200)
    const result = schema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('rejects amount exceeding remaining budget', () => {
    const schema = createBudgetItemSchema(50)
    const result = schema.safeParse(validItem)
    expect(result.success).toBe(false)
    if (!result.success) {
      const amountError = result.error.issues.find(
        (i) => i.path[0] === 'amount',
      )
      expect(amountError).toBeDefined()
      expect(amountError?.message).toContain('remaining budget')
    }
  })

  it('still rejects zero amount', () => {
    const schema = createBudgetItemSchema(500)
    const result = schema.safeParse({ ...validItem, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('still rejects missing category_id', () => {
    const schema = createBudgetItemSchema(500)
    const result = schema.safeParse({ ...validItem, category_id: '' })
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`

Expected: FAIL — `createBudgetItemSchema` is not exported.

- [ ] **Step 3: Implement `createBudgetItemSchema`**

In `src/lib/schemas/budget/budget-item.schema.ts`, add after the existing `budgetItemSchema` definition (line 10), before the `BudgetItemFormData` type export:

```ts
export const createBudgetItemSchema = (remainingBudget: number) =>
  budgetItemSchema.refine((data) => data.amount <= remainingBudget, {
    message: `Amount cannot exceed the remaining budget ($${remainingBudget.toFixed(2)})`,
    path: ['amount'],
  })
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/schemas/budget/budget-item.schema.ts src/lib/schemas/budget/__tests__/budget-item.schema.test.ts
git commit -m "feat: add createBudgetItemSchema factory for remaining budget validation"
```

---

### Task 2: Update `BudgetCategoryForm` to use dynamic schema and show helper text

**Files:**

- Modify: `src/routes/_app/budget/-components/budget-item/BudgetCategoryForm.tsx`

- [ ] **Step 1: Add `remainingBudget` prop to the interface**

In `BudgetCategoryForm.tsx`, update the `BudgetCategoryFormProps` interface:

```ts
interface BudgetCategoryFormProps {
  isPending: boolean
  onSubmit: (data: BudgetItemFormData) => void
  remainingBudget: number
  selectedBudgetItem: BudgetItemFormData | null
  usedCategoryIds: Array<string>
}
```

- [ ] **Step 2: Replace static schema with dynamic schema**

Update the imports — replace `budgetItemSchema` with `createBudgetItemSchema`:

```ts
import {
  createBudgetItemSchema,
  type BudgetItemFormData,
} from '@/lib/schemas/budget/budget-item.schema'
```

Remove the separate `import type` line for `BudgetItemFormData` (line 4) since it's now combined above.

Add `remainingBudget` to the destructured props:

```ts
export const BudgetCategoryForm = ({
  isPending,
  onSubmit,
  remainingBudget,
  selectedBudgetItem,
  usedCategoryIds,
}: BudgetCategoryFormProps) => {
```

Add a `useMemo` for the dynamic schema (after the `categoryOptions` memo, before `defaultValues`):

```ts
const schema = useMemo(
  () => createBudgetItemSchema(remainingBudget),
  [remainingBudget],
)
```

Update the `useForm` call to use the dynamic schema:

```ts
const form = useForm<BudgetItemFormData>({
  resolver: zodResolver(schema),
  defaultValues: defaultValues,
})
```

- [ ] **Step 3: Add helper text and error message to the amount field**

Add `FormDescription` and `FormMessage` to the form imports:

```ts
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
```

Replace the entire amount `FormField` block (lines 116–129) with:

```tsx
<FormField
  control={form.control}
  name="amount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Set your limit: </FormLabel>
      <FormControl>
        <CurrencyInput value={field.value} onChange={field.onChange} />
      </FormControl>
      <FormDescription>
        Remaining budget: ${remainingBudget.toFixed(2)}
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

- [ ] **Step 4: Verify the form still renders (manual check)**

Run: `npm run dev`

Open the budget page, click "Add Budget". Confirm the form renders (it will show a TypeScript error in the console because `BudgetOverview` doesn't pass `remainingBudget` yet — that's expected and fixed in Task 3).

- [ ] **Step 5: Commit**

```bash
git add src/routes/_app/budget/-components/budget-item/BudgetCategoryForm.tsx
git commit -m "feat: use dynamic schema and show remaining budget in BudgetCategoryForm"
```

---

### Task 3: Compute and pass `remainingBudget` from `BudgetOverview`

**Files:**

- Modify: `src/routes/_app/budget/-components/budget-item/BudgetOverview.tsx`

- [ ] **Step 1: Import `useBudgetOverview` and compute remaining budget**

Add the import:

```ts
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
```

Inside the component, after the existing `useBudgetItems` call (line 21), add:

```ts
const { data: budgetOverviews } = useBudgetOverview()

const remainingBudget = useMemo(() => {
  const overview = budgetOverviews?.find((b) => b.budget_id === budgetId)
  const totalBudget = overview?.budget_amount ?? 0
  const allocatedAmount =
    budgetItems?.reduce((sum, item) => sum + item.amount, 0) ?? 0
  return totalBudget - allocatedAmount
}, [budgetOverviews, budgetId, budgetItems])
```

- [ ] **Step 2: Pass `remainingBudget` to `BudgetCategoryForm`**

Update the `BudgetCategoryForm` usage (around line 49) to include the new prop:

```tsx
<BudgetCategoryForm
  isPending={false}
  onSubmit={(data) => console.log(data)}
  remainingBudget={remainingBudget}
  selectedBudgetItem={null}
  usedCategoryIds={usedCategoryIds}
/>
```

- [ ] **Step 3: Run lint and type check**

Run: `npm run check && npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`

Test the following:

1. Open a budget with existing items — the helper text shows the correct remaining amount
2. Enter an amount exceeding the remaining budget — a validation error appears on submit
3. Enter an amount within the remaining budget — form submits successfully

- [ ] **Step 5: Commit**

```bash
git add src/routes/_app/budget/-components/budget-item/BudgetOverview.tsx
git commit -m "feat: compute remaining budget and pass to BudgetCategoryForm"
```
