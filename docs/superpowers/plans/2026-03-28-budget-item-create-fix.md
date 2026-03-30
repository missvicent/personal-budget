# Fix: Budget Item Create Submit Not Working

**Date:** 2026-03-28
**Branch:** ft/budget

## Problem

The "Add Budget" form in the budget detail view appeared to do nothing when submitted. No errors, no feedback, no creation.

## Root Cause

The Zod form schema required `category_name: z.string().min(1)`, but the form never collects or sets `category_name` — it only collects `category_id`. Since `react-hook-form` with `zodResolver` silently blocks `onSubmit` when validation fails, the form appeared completely unresponsive.

Additionally, `budget_id` was optional in the schema and never populated in the form's `defaultValues`, which would have caused a database insert failure even if validation passed.

## Changes

### 1. Schema — `src/lib/schemas/budget/budget-item.schema.ts`

- Removed `category_name` field (not a form input; derived from `category_id` via DB join)
- Changed `budget_id` from `z.string().optional()` to `z.string().min(1)` (required for DB insert)

### 2. Form — `src/routes/_app/budget/-components/budget-item/BudgetCategoryForm.tsx`

- Added `budgetId: string` prop
- Set `budget_id: budgetId` in form `defaultValues` so the payload always includes it

### 3. Overview — `src/routes/_app/budget/-components/budget-item/BudgetOverview.tsx`

- Passed `budgetId={budgetId}` to `<BudgetCategoryForm>`
- Replaced `isPending={false}` with `isPending={userBudgetItemHandlers.isPending}`
- Passed `dialog.onOpenChange(false)` as `onSuccess` callback to close dialog after creation

### 4. Handler — `src/routes/_app/budget/-hooks/user-budget-item-handlers.ts`

- Passed `{ onSuccess }` options to `mutations.createBudgetItem()` with `toast.success()` notification (matching the pattern in `use-budget-handlers.ts`)
- Returns `isPending: mutations.isCreating` so the parent can disable the submit button

### 5. Mutation Hook — `src/hooks/budget/use-budget-item-create.ts`

- Changed input type from `BudgetItem` to `Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>` to match the service layer signature
- Added null guard for `budgetItem.budget_id` in `onSuccess` cache invalidation

### 6. Card (pre-existing fix) — `src/routes/_app/budget/-components/budget-item/BudgetItemCard.tsx`

- Fixed TypeScript error: `budgetItem.budget_amount` is possibly `undefined` — added fallback `?? 1`

### 7. Tests — `src/lib/schemas/budget/__tests__/budget-item.schema.test.ts`

- Updated test fixture: removed `category_name`, added `budget_id` to match new schema

## Verification

- `npm run check` — lint/format clean
- `npm run build` — TypeScript compiles, exit 0
- `npm run test` — 37/37 tests pass
