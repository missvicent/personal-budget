# Budget Amount Validation

## Problem

When adding or editing a budget category item, there is no upper-bound validation on the amount. Users can allocate more than the total budget or more than the remaining unallocated budget.

## Solution

Add dynamic Zod validation that prevents the amount from exceeding the remaining budget, plus helper text showing the remaining amount.

## Data Flow

1. **BudgetOverview** computes `remainingBudget`:
   - Gets `budget_amount` from `useBudgetOverview()` filtered by the current `budgetId`
   - Sums all existing budget items' `amount` values (`allocatedAmount`)
   - When editing: excludes the selected item's amount from the sum
   - `remainingBudget = totalBudget - allocatedAmount`
2. **BudgetOverview** passes `remainingBudget` as a prop to **BudgetCategoryForm**
3. **BudgetCategoryForm** uses `remainingBudget` to:
   - Create a dynamic schema via `createBudgetItemSchema(remainingBudget)`
   - Display helper text below the amount input: "Remaining budget: $X.XX"

## Schema Changes (`budget-item.schema.ts`)

- Add `createBudgetItemSchema(remainingBudget: number)` factory function
- Returns the base `budgetItemSchema` with a `.refine()` checking `amount <= remainingBudget`
- Error message: `"Amount cannot exceed the remaining budget ($X.XX)"`
- Keep the static `budgetItemSchema` export unchanged for type inference (`BudgetItemFormData`)

## Component Changes

### BudgetCategoryForm

- New prop: `remainingBudget: number`
- Use `useMemo` to create the dynamic schema from `remainingBudget`
- Add helper text under the amount `FormItem` showing "Remaining budget: $X.XX"

### BudgetOverview

- Import and use `useBudgetOverview()` to get the total `budget_amount`
- Compute `allocatedAmount` as the sum of all budget items' `amount`
- When editing (if `selectedBudgetItem` has an existing amount), exclude it from the sum
- Pass `remainingBudget = totalBudget - allocatedAmount` to `BudgetCategoryForm`

## Files Changed

1. `src/lib/schemas/budget/budget-item.schema.ts` — add `createBudgetItemSchema` factory
2. `src/routes/_app/budget/-components/budget-item/BudgetCategoryForm.tsx` — new prop, dynamic schema, helper text
3. `src/routes/_app/budget/-components/budget-item/BudgetOverview.tsx` — compute and pass `remainingBudget`

## Validation Behavior

- On form submit, if `amount > remainingBudget`, a field error appears under the amount input
- Helper text "Remaining budget: $X.XX" is always visible below the amount input (both create and edit flows)
- When editing, the current item's amount is excluded from the allocated sum so the user can re-enter up to their previous allocation plus any remaining budget
