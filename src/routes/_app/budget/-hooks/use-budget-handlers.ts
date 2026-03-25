import { toast } from 'sonner'

import { useBudgetMutations } from './use-budget-mutations'
import type { Budget } from '@/types/database.types'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'
import { toBudgetItemRequestBody } from '@/lib/schemas/budget/budget-item.schema'

export const useBudgetHandlers = (
  selectedBudget: Budget | null,
  onSuccess: () => void,
) => {
  const mutations = useBudgetMutations()

  const handleSubmit = (data: BudgetItemFormData) => {
    const body = toBudgetItemRequestBody({ ...data, id: selectedBudget?.id })
    const action = selectedBudget ? mutations.update : mutations.create
    const message = selectedBudget
      ? 'Budget updated successfully'
      : 'Budget created successfully'

    action(body, {
      onSuccess: () => {
        toast.success(message)
        onSuccess()
      },
    })
  }

  const handleDelete = (id: string) => {
    mutations.remove(id, {
      onSuccess: () => toast.success('Budget deleted successfully'),
    })
  }

  return {
    handleSubmit,
    handleDelete,
    isPending: mutations.isCreating || mutations.isUpdating,
  }
}
