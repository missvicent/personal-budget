import { useAuthQuery } from '../auth/use-auth-query'
import type { BudgetWithProgress } from '@/types/budget.types'
import { useBudgetQueryKeys } from '@/hooks/budget/use-budget-query-keys'
import { budgetService } from '@/services/budget.service'

export const useAllocations = (budgetId: string) => {
  return useAuthQuery<Array<BudgetWithProgress>>(
    useBudgetQueryKeys().allocation(budgetId),
    async (supabase) => {
      const all = await budgetService.getAllWithProgress(supabase)
      return all.filter((item) => item.budget_id === budgetId)
    },
    {
      retry: false,
    },
  )
}
