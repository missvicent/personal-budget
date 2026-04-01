import { useMemo } from 'react'
import { useBudgetItems } from '@/hooks/budget/use-budget-item'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'

export const useRemainingBudget = (budgetId: string) => {
  const { data: budgetItems } = useBudgetItems(budgetId)
  const { data: budgetOverviews } = useBudgetOverview()

  return useMemo(() => {
    const overview = budgetOverviews?.find((b) => b.budget_id === budgetId)
    const totalBudget = overview?.budget_amount ?? 0
    const allocatedAmount =
      budgetItems?.reduce((sum, item) => sum + item.amount, 0) ?? 0
    return Math.max(0, totalBudget - allocatedAmount)
  }, [budgetOverviews, budgetId, budgetItems])
}
