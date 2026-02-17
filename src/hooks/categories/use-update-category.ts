import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useCategoriesQueryKeys } from './use-categories-query-keys'
import type { Category } from '@/types/database.types'
import { categoriesService } from '@/services/categories.service'

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useAuthMutation<Category, Partial<Category & { id: string }>, Error>(
    (category, supabase) =>
      categoriesService.update(category.id || '', category, supabase),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: useCategoriesQueryKeys().categories(),
        })
      },
    },
  )
}
