import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

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
  const navigate = useNavigate()

  const handleSubmit = (
    data: BudgetFormData,
    dirtyFields: Partial<Record<keyof BudgetFormData, boolean>>,
  ) => {
    if (selectedBudget) {
      mutations.update(
        toUpdateRequestBody({ ...data, id: selectedBudget.id }, dirtyFields),
        {
          onSuccess: () => {
            toast.success('Budget updated successfully')
            onSuccess()
          },
        },
      )
    } else {
      mutations.create(toBudgetRequestBody(data), {
        onSuccess: (created: Budget) => {
          toast.success('Budget created successfully')
          if (created.id) {
            navigate({
              to: '/budget/$budgetId',
              params: { budgetId: created.id },
            })
          }
          onSuccess()
        },
      })
    }
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
