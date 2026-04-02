import { useCreateBudgetItem } from '@/hooks/budget/use-budget-item-create'
import { useDeleteBudgetItem } from '@/hooks/budget/use-budget-item-delete'

export const useAllocationMutations = () => {
  const { mutate: createBudgetItem, isPending: isCreating } =
    useCreateBudgetItem()
  const { mutate: deleteBudgetItem, isPending: isDeleting } =
    useDeleteBudgetItem()
  return { createBudgetItem, deleteBudgetItem, isCreating, isDeleting }
}
