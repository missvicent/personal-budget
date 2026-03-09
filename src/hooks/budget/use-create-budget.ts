import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { Budget } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useCreateBudget = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>, supabase) =>
      budgetService.create(budget, supabase),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: useBudgetQueryKeys().budgets(),
        })
      },
    },
  )
}
