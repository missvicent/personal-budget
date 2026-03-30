import { useQueryClient } from '@tanstack/react-query'

import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from './use-budget-query-keys'
import type { BudgetItem } from '@/types/database.types'
import { budgetItemService } from '@/services/budget-item.service'

export const useCreateBudgetItem = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (
      budgetItem: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>,
      supabase,
    ) => budgetItemService.create(budgetItem, supabase),
    {
      onSuccess: (budgetItem: BudgetItem) => {
        queryClient.invalidateQueries({
          queryKey: useBudgetQueryKeys().budgetItem(budgetItem.budget_id),
        })
      },
    },
  )
}
