import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { BudgetItem } from '@/types/database.types'
import { budgetItemService } from '@/services/budget-item.service'

export const useDeleteBudgetItem = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (id, supabase) => budgetItemService.delete(id, supabase),
    {
      onMutate: async (id: string) => {
        const queryKey = useBudgetQueryKeys().budgetItem(id)
        await queryClient.cancelQueries({ queryKey })
        const previousBudgetItem =
          queryClient.getQueryData<BudgetItem>(queryKey)
        queryClient.setQueryData(queryKey, (old: Array<BudgetItem>) =>
          old.filter((item) => item.id !== id),
        )
        return {
          previousBudgetItem,
          queryKey: useBudgetQueryKeys().budgetItem(id),
        }
      },
      onSettled: (_data, error, _variables, context) => {
        if (error) {
          if (context?.previousBudgetItem) {
            queryClient.setQueryData(
              context.queryKey,
              context.previousBudgetItem,
            )
          }
        }
      },
    },
  )
}
