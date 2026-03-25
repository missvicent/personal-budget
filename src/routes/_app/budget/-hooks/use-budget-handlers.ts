import { toast } from 'sonner'

import { useBudgetMutations } from './use-budget-mutations'
import type { Budget } from '@/types/database.types'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'
import {
  toBudgetItemRequestBody,
  toUpdateRequestBody,
} from '@/lib/schemas/budget/budget-item.schema'

export const useBudgetHandlers = (
  selectedBudget: Budget | null,
  onSuccess: () => void,
) => {
  const mutations = useBudgetMutations()

  const handleSubmit = (
    data: BudgetItemFormData,
    dirtyFields: Partial<Record<keyof BudgetItemFormData, boolean>>,
  ) => {
    const isUpdate = !!selectedBudget
    const body = isUpdate
      ? toUpdateRequestBody({ ...data, id: selectedBudget.id }, dirtyFields)
      : toBudgetItemRequestBody(data)
    const action = isUpdate ? mutations.update : mutations.create
    const message = isUpdate
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
