import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { BudgetOverview } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()
  return useAuthMutation((id, supabase) => budgetService.delete(id, supabase), {
    onMutate: async (id: string) => {
      const queryKey = useBudgetQueryKeys().overview()
      await queryClient.cancelQueries({ queryKey })
      const previousBudgets =
        queryClient.getQueryData<Array<BudgetOverview>>(queryKey)
      queryClient.setQueryData(queryKey, (old: Array<BudgetOverview>) =>
        old.filter((budget) => budget.budget_id !== id),
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
