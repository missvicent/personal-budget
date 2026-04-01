import type { TransactionFilters } from '@/types/transaction.types'

export const useTransactionsQueryKeys = () => {
  return {
    transaction: (id: string) => ['transactions', id],
    transactions: (filters: TransactionFilters) => ['transactions', filters],
    transactionsWithCategories: (budgetId?: string) =>
      budgetId
        ? ['transactions', 'with-categories', budgetId]
        : ['transactions', 'with-categories'],
  }
}
