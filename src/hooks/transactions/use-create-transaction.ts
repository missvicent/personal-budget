import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from '../budget/use-budget-query-keys'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import type { CreateTransaction } from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (transaction: CreateTransaction, supabase) =>
      transactionsService.create(transaction, supabase),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: useTransactionsQueryKeys().transactions({}),
        })
        queryClient.invalidateQueries({
          queryKey: useTransactionsQueryKeys().transactionsWithCategories(),
        })
        queryClient.invalidateQueries({
          queryKey: useBudgetQueryKeys().overview(),
        })
        queryClient.invalidateQueries({
          queryKey: useBudgetQueryKeys().budgets(),
        })
      },
    },
  )
}
