import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import type { Allocation } from '@/types/database.types'
import { useBudgetQueryKeys } from '@/hooks/budget/use-budget-query-keys'
import { allocationService } from '@/services/allocation.service'

export const useDeleteAllocation = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    ({ id, budgetId }: { id: string; budgetId: string }, supabase) =>
      allocationService.delete(budgetId, id, supabase),
    {
      onMutate: async ({ id, budgetId }: { id: string; budgetId: string }) => {
        const queryKey = useBudgetQueryKeys().allocation(budgetId)
        await queryClient.cancelQueries({ queryKey })
        const previousAllocation =
          queryClient.getQueryData<Allocation>(queryKey)
        queryClient.setQueryData(queryKey, (old: Array<Allocation>) =>
          old.filter((item) => item.id !== id),
        )
        return {
          previousAllocation,
          queryKey: useBudgetQueryKeys().allocation(id),
        }
      },
      onSettled: (_data, error, _variables, context) => {
        if (error) {
          if (context?.previousAllocation) {
            queryClient.setQueryData(
              context.queryKey,
              context.previousAllocation,
            )
          }
        }
        queryClient.invalidateQueries({ queryKey: context?.queryKey })
        queryClient.invalidateQueries({
          queryKey: useBudgetQueryKeys().budgets(),
        })
      },
    },
  )
}
