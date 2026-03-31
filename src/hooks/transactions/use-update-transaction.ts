import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useBudgetQueryKeys } from '../budget/use-budget-query-keys'
import { useTransactionsQueryKeys } from './use-transactions-query-keys'
import type { Transaction } from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (transaction, supabase) =>
      transactionsService.update(transaction.id ?? '', transaction, supabase),
    {
      onMutate: async (
        updatedTransaction: Partial<Transaction & { id: string }>,
      ) => {
        const queryKey = useTransactionsQueryKeys().transactionsWithCategories()
        await queryClient.cancelQueries({ queryKey })
        const previousTransactions =
          queryClient.getQueryData<Array<Transaction>>(queryKey)
        queryClient.setQueryData(queryKey, (old: Array<Transaction>) =>
          old.map((old_transaction) =>
            old_transaction.id === updatedTransaction.id
              ? { ...old_transaction, ...updatedTransaction }
              : old_transaction,
          ),
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
          return
        }
        queryClient.invalidateQueries({
          queryKey: context?.queryKey,
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
