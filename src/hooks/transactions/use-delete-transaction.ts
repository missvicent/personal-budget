import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import type { Transaction } from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (id, supabase) => transactionsService.delete(id, supabase),
    {
      onMutate: async (id: string) => {
        const queryKey = useTransactionsQueryKeys().transactionsWithCategories()
        await queryClient.cancelQueries({ queryKey })
        const previousTransactions =
          queryClient.getQueryData<Array<Transaction>>(queryKey) || []
        queryClient.setQueryData(
          queryKey,
          (old: Array<Transaction> | undefined) =>
            old?.filter((transaction) => transaction.id !== id) || [],
        )
        return { previousTransactions, queryKey }
      },
      onSettled: (_data, error, _variables, context) => {
        if (error) {
          if (context?.previousTransactions) {
            queryClient.setQueryData(
              context.queryKey,
              context.previousTransactions,
            )
          }
        }
        queryClient.invalidateQueries({
          queryKey: context?.queryKey,
        })
      },
    },
  )
}
