import { useAuthQuery } from '../auth/use-auth-query'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import type {
  PaginatedResponse,
  Transaction,
  TransactionFilters,
} from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

export const useGetTransactions = (filters: TransactionFilters) => {
  return useAuthQuery<PaginatedResponse<Transaction>>(
    useTransactionsQueryKeys().transactions(filters),
    (supabase) => transactionsService.getAll(supabase, filters),
    {
      retry: false,
    },
  )
}
