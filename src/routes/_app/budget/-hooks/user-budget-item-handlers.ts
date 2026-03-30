import { toast } from 'sonner'

import { useBudgetItemMutations } from './use-budget-item-mutations'
import type { BudgetWithProgress } from '@/types/budget.types'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'
import { toBudgetItemPayload } from '@/lib/schemas/budget/budget-item.schema'

export const useBudgetItemHandlers = (
  selectedBudgetItem: BudgetWithProgress | null,
  onSuccess: () => void,
) => {
  const mutations = useBudgetItemMutations()

  const handleSubmit = (data: BudgetItemFormData) => {
    if (selectedBudgetItem) {
      // mutations.updateBudgetItem(data)
    } else {
      mutations.createBudgetItem(toBudgetItemPayload(data), {
        onSuccess: () => {
          toast.success('Budget item created successfully')
          onSuccess()
        },
      })
    }
  }

  return {
    handleSubmit,
    isPending: mutations.isCreating,
  }
}
