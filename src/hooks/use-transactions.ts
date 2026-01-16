import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  PaginatedResponse,
  Transaction,
  TransactionFilters,
} from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

const queryClient = useQueryClient()

export const queryKeys = {
  transactions: () => ['transactions'],
  transaction: (id: string) => ['transactions', id],
}

export const useTransactions = (
  supabase: SupabaseClient,
  filters: TransactionFilters,
) => {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: queryKeys.transactions(),
    queryFn: () => transactionsService.getAll(supabase, filters),
  })
}

export const useCreateTransaction = (
  transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
  supabase: SupabaseClient,
) => {
  return useMutation<
    Transaction,
    Error,
    Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
  >({
    mutationFn: () => transactionsService.create(transaction, supabase),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.setQueryData(
        queryKeys.transactions(),
        (old: Array<Transaction>) => [...old, data],
      )
    },
  })
}

export const useUpdateTransaction = (
  id: string,
  transaction: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>,
  supabase: SupabaseClient,
) => {
  return useMutation<
    Transaction,
    Error,
    Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
  >({
    mutationFn: () => transactionsService.update(id, transaction, supabase),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.setQueryData(
        queryKeys.transactions(),
        (old: Array<Transaction>) => old.map((t) => (t.id === id ? data : t)),
      )
    },
  })
}

export const useDeleteTransaction = (id: string, supabase: SupabaseClient) => {
  return useMutation<void, Error, string>({
    mutationFn: () => transactionsService.delete(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.removeQueries({ queryKey: queryKeys.transaction(id) })
    },
  })
}
