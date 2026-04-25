import type { Budget, BudgetOverview } from '@/types/database.types'
import type {
  SelectOptionGroup,
  SelectOptionItem,
} from '@/types/selectOptions.types'

const GROUP_BY_PERIOD: Array<BudgetOverview['period']> = ['monthly', 'yearly']

const PERIOD_COLORS: Record<BudgetOverview['period'], string> = {
  monthly: 'var(--color-period-monthly)',
  yearly: 'var(--color-period-yearly)',
}

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

export const toBudgetOption = (budget: BudgetOverview): SelectOptionItem => ({
  color: PERIOD_COLORS[budget.period],
  description: budget.budget_amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }),
  icon: budget.budget_name.slice(0, 1).toUpperCase(),
  label: budget.budget_name,
  selectedOptionLabel: budget.period,
  value: budget.budget_id,
})

export const toBudgetOptions = (
  budgetOverviews: Array<BudgetOverview>,
): Array<SelectOptionGroup> =>
  GROUP_BY_PERIOD.flatMap((period) => {
    const items = budgetOverviews
      .filter((budget) => budget.period === period)
      .map(toBudgetOption)
    return items.length === 0 ? [] : [{ groupLabel: period, items }]
  })
