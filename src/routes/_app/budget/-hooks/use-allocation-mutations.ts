import { useCreateBudgetItem } from '@/hooks/budget/use-budget-item-create'

export const useAllocationMutations = () => {
  const { mutate: createBudgetItem, isPending: isCreating } =
    useCreateBudgetItem()
  return { createBudgetItem, isCreating }
}
