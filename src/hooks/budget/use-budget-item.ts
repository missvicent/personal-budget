import { useAuthQuery } from '../auth/use-auth-query'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { BudgetWithProgress } from '@/types/budget.types'
import { budgetService } from '@/services/budget.service'

export const useBudgetItems = (budgetId: string) => {
  return useAuthQuery<Array<BudgetWithProgress>>(
    useBudgetQueryKeys().budgetItem(budgetId),
    async (supabase) => {
      const all = await budgetService.getAllWithProgress(supabase)
      return all.filter((item) => item.budget_id === budgetId)
    },
    {
      retry: false,
    },
  )
}
