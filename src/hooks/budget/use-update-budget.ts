import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { Budget } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

export const useUpdateBudget = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (budget: Budget, supabase) =>
      budgetService.update(budget.id || '', budget, supabase),
    {
      onMutate: async (budget: Budget) => {
        const queryKey = useBudgetQueryKeys().budgets()
        await queryClient.cancelQueries({ queryKey })
        const previousBudgets =
          queryClient.getQueryData<Array<Budget>>(queryKey)
        queryClient.setQueryData(queryKey, (old: Array<Budget>) =>
          old.map((old_budget) =>
            old_budget.id === budget.id ? budget : old_budget,
          ),
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
    },
  )
}
