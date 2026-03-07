import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useCategoriesQueryKeys } from './use-categories-query-keys'
import { categoriesService } from '@/services/categories.service'

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useAuthMutation<void, string, Error, unknown>(
    (id, supabase) => categoriesService.delete(id, supabase),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: useCategoriesQueryKeys().categories(),
        })
      },
    },
  )
}
