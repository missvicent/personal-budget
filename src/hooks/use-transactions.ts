import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  PaginatedResponse,
  Transaction,
  TransactionFilters,
  TransactionWithCategory,
} from '@/types/database.types'
import { transactionsService } from '@/services/transactions.service'
import { useSupabase } from '@/contexts/SupabaseContext'

const queryKeys = {
  transactions: (filters: TransactionFilters) => ['transactions', filters],
  transaction: (id: string) => ['transactions', id],
  transactionsWithCategories: () => ['transactions', 'with-categories'],
}

export const useTransactions = (filters: TransactionFilters) => {
  const supabase = useSupabase()
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: queryKeys.transactions(filters),
    queryFn: () => transactionsService.getAll(supabase, filters),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useCreateTransaction = () => {
  const supabase = useSupabase()
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactionsWithCategories(),
      })
    },
  })
}

export const useUpdateTransaction = () => {
  const supabase = useSupabase()
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

export const useDeleteTransaction = () => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => transactionsService.delete(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions({}) })
    },
  })
}

export const useGetTransactionsWithCategories = () => {
  const supabase = useSupabase()
  return useQuery<Array<TransactionWithCategory>>({
    queryKey: queryKeys.transactionsWithCategories(),
    queryFn: () => transactionsService.getTransactionsWithCategories(supabase),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
