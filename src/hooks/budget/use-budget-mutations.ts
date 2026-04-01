import { useCreateBudget } from '@/hooks/budget/use-create-budget'
import { useDeleteBudget } from '@/hooks/budget/use-delete-budget'
import { useUpdateBudget } from '@/hooks/budget/use-update-budget'

export const useBudgetMutations = () => {
  const { mutate: create, isPending: isCreating } = useCreateBudget()
  const { mutate: update, isPending: isUpdating } = useUpdateBudget()
  const { mutate: remove, isPending: isDeleting } = useDeleteBudget()

  return { create, update, remove, isCreating, isUpdating, isDeleting }
}
