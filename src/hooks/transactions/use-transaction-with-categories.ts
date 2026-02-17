import { useAuthQuery } from '../auth/use-auth-query'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import type { TransactionWithCategory } from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

export const useGetTransactionsWithCategories = () => {
  return useAuthQuery<Array<TransactionWithCategory>>(
    useTransactionsQueryKeys().transactionsWithCategories(),
    (supabase) => transactionsService.getTransactionsWithCategories(supabase),
    {
      retry: false,
    },
  )
}
