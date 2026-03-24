import { toast } from 'sonner'

import type { Budget } from '@/types/database.types'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'
import { toBudgetItemRequestBody } from '@/lib/schemas/budget/budget-item.schema'

import { useCreateBudget } from '@/hooks/budget/use-create-budget'
import { useDeleteBudget } from '@/hooks/budget/use-delete-budget'
import { useUpdateBudget } from '@/hooks/budget/use-update-budget'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'

export const useBudgetActions = (onSuccess: () => void) => {
  const { mutate: createBudget, isPending: isCreating } = useCreateBudget()
  const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget()
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget()
  const { data: budgets } = useBudgetOverview()

  const onSubmit = (
    data: BudgetItemFormData,
    selectedBudget: Budget | null,
  ) => {
    if (selectedBudget) {
      updateBudget(
        { ...toBudgetItemRequestBody({ ...data, id: selectedBudget.id }) },
        {
          onSuccess: () => {
            toast.success('Budget updated successfully')
            onSuccess()
          },
        },
      )
    } else {
      createBudget(toBudgetItemRequestBody(data), {
        onSuccess: () => {
          toast.success('Budget created successfully')
          onSuccess()
        },
      })
    }
  }

  const onDelete = (id: string) => {
    deleteBudget(id, {
      onSuccess: () => toast.success('Budget deleted successfully'),
    })
  }

  const getBudgets = () => {
    return budgets ?? []
  }

  return {
    getBudgets,
    isCreating,
    isDeleting,
    isUpdating,
    onDelete,
    onSubmit,
  }
}
