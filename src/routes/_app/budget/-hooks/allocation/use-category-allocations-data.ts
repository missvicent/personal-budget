import { useAllocationMutations } from './use-allocation-mutations'
import { useBudgetItems } from '@/hooks/budget/use-budget-item'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { useGetTransactionsWithCategories } from '@/hooks/transactions/use-transaction-with-categories'
import { getOverspendingTransactionIds } from '@/lib/budget.utils'

const EMPTY_SET = new Set<string>()

export const useCategoryAllocationsData = (budgetId: string) => {
  const { data: budgetItems, isLoading: isLoadingItems } =
    useBudgetItems(budgetId)

  const { data: budgetOverviews, isLoading: isLoadingOverview } =
    useBudgetOverview()

  const { data: transactionsWithCategories } =
    useGetTransactionsWithCategories(budgetId)

  const { deleteBudgetItem, isDeleting } = useAllocationMutations()

  const budgetAmount =
    budgetOverviews?.find((b) => b.budget_id === budgetId)?.budget_amount ?? 0

  const isLoading = isLoadingItems || isLoadingOverview

  const overspendingCategoryIds =
    transactionsWithCategories && budgetOverviews
      ? getOverspendingTransactionIds(transactionsWithCategories, budgetAmount)
          .categoryIds
      : EMPTY_SET

  return {
    budgetItems,
    isLoading,
    overspendingCategoryIds,
    deleteBudgetItem,
    isDeleting,
  }
}
