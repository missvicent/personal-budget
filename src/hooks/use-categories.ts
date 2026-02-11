import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Category } from '@/types/database.types'
import { categoriesService } from '@/services/categories.service'
import { useSupabase } from '@/contexts/SupabaseContext'

export const queryKeys = {
  categories: () => ['categories'],
  category: (id: string) => ['categories', id],
}

export const useCategories = () => {
  const supabase = useSupabase()
  return useQuery<Array<Category>>({
    queryKey: queryKeys.categories(),
    queryFn: () => categoriesService.getAll(supabase),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useCreateCategory = (
  category: Omit<Category, 'id' | 'created_at' | 'user_id'>,
) => {
  const supabase = useSupabase()
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
) => {
  const supabase = useSupabase()
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
