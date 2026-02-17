import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import type { Transaction } from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useAuthMutation<
    Transaction,
    Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
    Error
  >(
    (transaction, supabase) =>
      transactionsService.create(transaction, supabase),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: useTransactionsQueryKeys().transactions({}),
        })
        queryClient.invalidateQueries({
          queryKey: useTransactionsQueryKeys().transactionsWithCategories(),
        })
      },
    },
  )
}
