import { useAllocationMutations } from './use-allocation-mutations'
import { useAllocations } from '@/hooks/allocation/use-allocation'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { useGetTransactionsWithCategories } from '@/hooks/transactions/use-transaction-with-categories'
import { getOverspendingTransactionIds } from '@/lib/budget.utils'

const EMPTY_SET = new Set<string>()

export const useAllocationsData = (budgetId: string) => {
  const { data: allocations, isLoading: isLoadingAllocations } =
    useAllocations(budgetId)

  const { data: budgetOverviews, isLoading: isLoadingOverview } =
    useBudgetOverview()

  const { data: transactionsWithCategories } =
    useGetTransactionsWithCategories(budgetId)

  const { deleteAllocation, isDeleting } = useAllocationMutations()

  const budgetAmount =
    budgetOverviews?.find((b) => b.budget_id === budgetId)?.budget_amount ?? 0

  const isLoading = isLoadingAllocations || isLoadingOverview

  const overspendingCategoryIds =
    transactionsWithCategories && budgetOverviews
      ? getOverspendingTransactionIds(transactionsWithCategories, budgetAmount)
          .categoryIds
      : EMPTY_SET

  return {
    allocations,
    isLoading,
    overspendingCategoryIds,
    deleteAllocation,
    isDeleting,
  }
}
