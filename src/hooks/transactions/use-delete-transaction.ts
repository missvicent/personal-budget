import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import { transactionsService } from '@/services/transactions.service'

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  return useAuthMutation<void, string, Error>(
    (id, supabase) => transactionsService.delete(id, supabase),
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
