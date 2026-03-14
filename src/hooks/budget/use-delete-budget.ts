import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { Budget } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()
  return useAuthMutation((id, supabase) => budgetService.delete(id, supabase), {
    onMutate: async (id: string) => {
      const queryKey = useBudgetQueryKeys().budgets()
      await queryClient.cancelQueries({ queryKey })
      const previousBudgets = queryClient.getQueryData<Array<Budget>>(queryKey)
      queryClient.setQueryData(queryKey, (old: Array<Budget>) =>
        old.filter((budget) => budget.id !== id),
      )
      return { previousBudgets, queryKey }
    },
    onSettled: (_data, error, _variables, context) => {
      if (error) {
        if (context?.previousBudgets) {
          queryClient.setQueryData(context.queryKey, context.previousBudgets)
        }
      }
      queryClient.invalidateQueries({ queryKey: context?.queryKey })
    },
  })
}
