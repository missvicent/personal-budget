import { useQueryClient } from '@tanstack/react-query'

import { useAuthMutation } from '../auth/use-auth-mutation'
import type { Allocation } from '@/types/database.types'
import { useBudgetQueryKeys } from '@/hooks/budget/use-budget-query-keys'
import { allocationService } from '@/services/allocation.service'

export const useCreateAllocation = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (
      allocation: Omit<Allocation, 'id' | 'created_at' | 'updated_at'>,
      supabase,
    ) => allocationService.create(allocation, supabase),
    {
      onSuccess: (allocation: Allocation) => {
        queryClient.invalidateQueries({
          queryKey: useBudgetQueryKeys().allocation(allocation.budget_id),
        })
      },
    },
  )
}
