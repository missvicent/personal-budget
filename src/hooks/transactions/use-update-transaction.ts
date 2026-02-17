import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import type { Transaction } from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  return useAuthMutation<
    Transaction,
    Partial<Transaction & { id: string }>,
    Error
  >(
    (transaction, supabase) =>
      transactionsService.update(transaction.id ?? '', transaction, supabase),
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
