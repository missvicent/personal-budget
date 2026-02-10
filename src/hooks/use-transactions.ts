import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  PaginatedResponse,
  Transaction,
  TransactionFilters,
  TransactionWithCategory,
} from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'

const queryKeys = {
  transactions: (filters: TransactionFilters) => ['transactions', filters],
  transaction: (id: string) => ['transactions', id],
  transactionsWithCategories: () => ['transactions', 'with-categories'],
}

export const useTransactions = (
  supabase: SupabaseClient,
  filters: TransactionFilters,
) => {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: queryKeys.transactions(filters),
    queryFn: () => transactionsService.getAll(supabase, filters),
    enabled: !!supabase,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useCreateTransaction = (supabase: SupabaseClient) => {
  const queryClient = useQueryClient()
  return useMutation<
    Transaction,
    Error,
    Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
  >({
    mutationFn: (
      transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
    ) => transactionsService.create(transaction, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions({}) })
    },
  })
}

export const useUpdateTransaction = (supabase: SupabaseClient) => {
  const queryClient = useQueryClient()
  return useMutation<
    Transaction,
    Error,
    Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
  >({
    mutationFn: (
      transaction: Partial<Omit<Transaction, 'created_at' | 'updated_at'>>,
    ) =>
      transactionsService.update(transaction.id ?? '', transaction, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions({}) })
    },
  })
}

export const useDeleteTransaction = (supabase: SupabaseClient) => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => transactionsService.delete(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions({}) })
    },
  })
}

export const useGetTransactionsWithCategories = (supabase: SupabaseClient) => {
  return useQuery<Array<TransactionWithCategory>>({
    queryKey: queryKeys.transactionsWithCategories(),
    queryFn: () => transactionsService.getTransactionsWithCategories(supabase),
    enabled: !!supabase,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
