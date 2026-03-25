import type { Budget, BudgetOverview } from '@/types/database.types'

export const toBudget = (overview: BudgetOverview): Budget => ({
  id: overview.budget_id,
  name: overview.budget_name,
  amount: overview.budget_amount,
  period: overview.period,
  start_date: overview.start_date,
  end_date: overview.end_date,
  is_active: overview.is_active,
})

export const toBudgetOverview = (
  budget: Budget,
  existing: BudgetOverview,
): BudgetOverview => ({
  ...existing,
  budget_name: budget.name,
  budget_amount: budget.amount,
  period: budget.period ?? existing.period,
  start_date: budget.start_date,
  end_date: budget.end_date ?? existing.end_date,
  is_active: budget.is_active,
})
