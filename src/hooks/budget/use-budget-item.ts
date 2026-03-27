import { useAuthQuery } from '../auth/use-auth-query'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { BudgetItem } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useBudgetItems = (budgetId: string) => {
  return useAuthQuery<Array<BudgetItem>>(
    useBudgetQueryKeys().budgetItem(budgetId),
    (supabase) => budgetService.getBudgetItemsByBudgetId(budgetId, supabase),
    {
      retry: false,
    },
  )
}
