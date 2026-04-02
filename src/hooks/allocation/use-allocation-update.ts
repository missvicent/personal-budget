import { useQueryClient } from '@tanstack/react-query'

import { useAuthMutation } from '../auth/use-auth-mutation'
import type { Allocation } from '@/types/database.types'
import { useBudgetQueryKeys } from '@/hooks/budget/use-budget-query-keys'
import { allocationService } from '@/services/allocation.service'

export const useUpdateAllocation = () => {
  const queryClient = useQueryClient()
  const queryKeys = useBudgetQueryKeys()
  return useAuthMutation(
    ({ id, ...allocation }: { id: string } & Partial<Allocation>, supabase) =>
      allocationService.update(id, allocation, supabase),
    {
      onSuccess: (allocation: Allocation) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.allocation(allocation.budget_id),
        })
      },
    },
  )
}
