import type { BadgeColor, SpendingStatus } from '@/lib/colors'
import type { BudgetOverview } from '@/types/database.types'
import { getSpendingStatus, periodColors, spendingColors } from '@/lib/colors'
import { leftDays } from '@/lib/dates/leftDays'

export type BudgetBadge = { label: string; color: BadgeColor }

export const useBudgetCardDisplay = (budget: BudgetOverview) => {
  const { budget_amount, total_spent, period } = budget
  const progressValue =
    budget_amount > 0 ? (total_spent / budget_amount) * 100 : 0
  const status: SpendingStatus = getSpendingStatus(total_spent, budget_amount)
  const daysLeft = leftDays(new Date(budget.end_date ?? ''))
  const badges: Array<BudgetBadge> = [
    { label: status, color: spendingColors[status] },
    { label: period, color: periodColors[period] },
  ]

  return { progressValue, status, badges, daysLeft }
}
