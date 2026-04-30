import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { CreateBudget } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useCreateBudget = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (budget: CreateBudget, supabase) => budgetService.create(budget, supabase),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: useBudgetQueryKeys().overview(),
        })
      },
    },
  )
}
