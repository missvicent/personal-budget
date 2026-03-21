import { useAuthQuery } from '../auth/use-auth-query'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { BudgetOverview } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useBudgetOverview = () => {
  return useAuthQuery<Array<BudgetOverview>>(
    useBudgetQueryKeys().overview(),
    (supabase) => budgetService.getOverview(supabase),
    {
      retry: false,
    },
  )
}
