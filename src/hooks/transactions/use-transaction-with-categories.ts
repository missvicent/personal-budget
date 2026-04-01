import { useAuthQuery } from '../auth/use-auth-query'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import type { TransactionWithCategory } from '@/types/transaction.types'
import { transactionsService } from '@/services/transactions.service'

export const useGetTransactionsWithCategories = (budgetId: string) => {
  return useAuthQuery<Array<TransactionWithCategory>>(
    useTransactionsQueryKeys().transactionsWithCategories(budgetId),
    (supabase) =>
      transactionsService.getTransactionsWithCategories(supabase, budgetId),
    {
      retry: false,
    },
  )
}
