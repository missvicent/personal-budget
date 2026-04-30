import { useQueryClient } from '@tanstack/react-query'

import { useAuthMutation } from '../auth/use-auth-mutation'
import type { Allocation, CreateAllocation } from '@/types/database.types'
import { useBudgetQueryKeys } from '@/hooks/budget/use-budget-query-keys'
import { allocationService } from '@/services/allocation.service'

export const useCreateAllocation = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (allocation: CreateAllocation, supabase) =>
      allocationService.create(allocation, supabase),
    {
      onSuccess: (allocation: Allocation) => {
        queryClient.invalidateQueries({
          queryKey: useBudgetQueryKeys().allocation(allocation.budget_id),
        })
      },
    },
  )
}
