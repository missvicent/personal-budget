import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Category } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { categoriesService } from '@/services/categories.service'

export const queryKeys = {
  categories: () => ['categories'],
  category: (id: string) => ['categories', id],
}

export const useCategories = (supabase: SupabaseClient) => {
  return useQuery<Array<Category>>({
    queryKey: queryKeys.categories(),
    queryFn: () => categoriesService.getAll(supabase),
    enabled: !!supabase,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useCreateCategory = (
  category: Omit<Category, 'id' | 'created_at' | 'user_id'>,
  supabase: SupabaseClient,
) => {
  const queryClient = useQueryClient()
  return useMutation<
    Category,
    Error,
    Omit<Category, 'id' | 'created_at' | 'user_id'>
  >({
    mutationFn: () => categoriesService.create(category, supabase),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
      queryClient.setQueryData(
        queryKeys.categories(),
        (old: Array<Category>) => [...old, data],
      )
    },
  })
}

export const useUpdateCategory = (
  id: string,
  category: Partial<Omit<Category, 'id' | 'created_at' | 'user_id'>>,
  supabase: SupabaseClient,
) => {
  const queryClient = useQueryClient()
  return useMutation<
    Category,
    Error,
    Partial<Omit<Category, 'id' | 'created_at' | 'user_id'>>
  >({
    mutationFn: () => categoriesService.update(id, category, supabase),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
      queryClient.setQueryData(queryKeys.categories(), (old: Array<Category>) =>
        old.map((c) => (c.id === id ? data : c)),
      )
    },
  })
}
