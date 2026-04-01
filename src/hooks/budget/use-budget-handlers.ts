import { toast } from 'sonner'

import { useBudgetMutations } from './use-budget-mutations'
import type { Budget } from '@/types/database.types'
import type { BudgetFormData } from '@/lib/schemas/budget/budget.schema'
import {
  toBudgetRequestBody,
  toUpdateRequestBody,
} from '@/lib/schemas/budget/budget.schema'

export const useBudgetHandlers = (
  selectedBudget: Budget | null,
  onSuccess: () => void,
) => {
  const mutations = useBudgetMutations()

  const handleSubmit = (
    data: BudgetFormData,
    dirtyFields: Partial<Record<keyof BudgetFormData, boolean>>,
  ) => {
    const isUpdate = !!selectedBudget
    const body = isUpdate
      ? toUpdateRequestBody({ ...data, id: selectedBudget.id }, dirtyFields)
      : toBudgetRequestBody(data)
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
