# Budget Types Analysis: Budget vs BudgetOverview vs BudgetWithProgress

**Date:** 2026-03-23
**Status:** Decided — keep separate types
**Scope:** `src/types/budget.types.ts`

## Context

The budget module has three related types that appear to overlap:

| Type                 | Source                                     | Purpose                                                                                |
| -------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `Budget`             | Direct table row (`budgets`)               | Write model for create/update/delete operations                                        |
| `BudgetOverview`     | Supabase RPC (`get_budgets_overview`)      | Read model for card grid display, includes computed `total_spent`                      |
| `BudgetWithProgress` | Supabase RPC (`get_budgets_with_progress`) | Detailed read model with per-category breakdown (category name, color, icon, progress) |

## Field Comparison

### Budget (write model)

```
id, name, amount, period, start_date, end_date, is_active, created_at, updated_at
```

### BudgetOverview (summary read model)

```
budget_id, budget_name, budget_amount, period, start_date, end_date, is_active, total_spent
```

### BudgetWithProgress (detailed read model)

```
budget_id, budget_name, budget_amount, period, start_date, end_date, is_active,
item_id, category_id, amount, alert_enabled, alert_threshold,
category_name, category_type, category_color, category_icon, progress
```

## Key Differences

1. **Field naming:** `id`/`name`/`amount` vs `budget_id`/`budget_name`/`budget_amount` — the prefixed names come from PostgreSQL RPCs that join multiple tables and prefix columns to avoid ambiguity.

2. **Computed fields:** `BudgetOverview` adds `total_spent` (aggregate sum of expenses). `BudgetWithProgress` adds per-category detail and `progress`.

3. **Shape purpose:** `Budget` matches the `budgets` table schema for inserts/updates. The other two are flattened join results for display.

## Decision: Keep Separate

**Unification is not worth it.** Reasons:

- The field name differences originate in the SQL layer. Changing RPCs to alias back to `id`/`name`/`amount` is fragile if more tables are joined later.
- Adding a service-layer mapping to normalize field names adds complexity for no functional benefit.
- These types represent genuinely different concerns: write model vs read models with different levels of detail.
- Separating read and write models is a healthy pattern — each type is honest about what it contains.

## Usage Map

| Type                 | Used by                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `Budget`             | `budget.service.ts` (create, update), `use-budget-actions.ts` (form submission), `BudgetForm` |
| `BudgetOverview`     | `budget.service.ts` (getOverview), `use-budget-overview.ts`, `BudgetItem` component           |
| `BudgetWithProgress` | `budget.service.ts` (getAllWithProgress)                                                      |
