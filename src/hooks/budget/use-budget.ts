import { useAuthQuery } from '../auth/use-auth-query'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { Budget } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useBudgets = () => {
  return useAuthQuery<Array<Budget & { progress: number }>>(
    useBudgetQueryKeys().budgets(),
    (supabase) => budgetService.getAllWithProgress(supabase),
    {
      retry: false,
    },
  )
}
