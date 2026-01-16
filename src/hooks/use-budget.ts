import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Budget } from '@/types/database.types'
import { budgetService } from '@/services/budget.service'

const queryClient = useQueryClient()

export const queryKeys = {
  budgets: () => ['budgets'],
  budget: (id: string) => ['budgets', id],
}

export const useBudgets = (supabase: SupabaseClient) => {
  return useQuery<Array<Budget & { progress: number }>>({
    queryKey: queryKeys.budgets(),
    queryFn: () => budgetService.getAllWithProgress(supabase),
  })
}

export const useCreateBudget = (
  budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>,
  supabase: SupabaseClient,
) => {
  return useMutation<
    Budget,
    Error,
    Omit<Budget, 'id' | 'created_at' | 'updated_at'>
  >({
    mutationFn: () => budgetService.create(budget, supabase),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets() })
      queryClient.setQueryData(
        queryKeys.budgets(),
        (old: Array<Budget & { progress: number }>) => [...old, data],
      )
    },
  })
}

export const useDeleteBudget = (id: string, supabase: SupabaseClient) => {
  return useMutation<void, Error, string>({
    mutationFn: () => budgetService.delete(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets() })
      queryClient.removeQueries({ queryKey: queryKeys.budget(id) })
    },
  })
}

export const useUpdateBudget = (
  id: string,
  budget: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>>,
  supabase: SupabaseClient,
) => {
  return useMutation<
    Budget,
    Error,
    Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>>
  >({
    mutationFn: () => budgetService.update(id, budget, supabase),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.budget(id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.budget(id) })
    },
  })
}
