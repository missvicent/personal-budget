import type { TransactionFilters } from '@/types/database.types'

export const useTransactionsQueryKeys = () => {
  return {
    transaction: (id: string) => ['transactions', id],
    transactions: (filters: TransactionFilters) => ['transactions', filters],
    transactionsWithCategories: () => ['transactions', 'with-categories'],
  }
}
