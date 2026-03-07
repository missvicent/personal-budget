import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useCategoriesQueryKeys } from './use-categories-query-keys'
import type { Category } from '@/types/database.types'
import { categoriesService } from '@/services/categories.service'

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useAuthMutation(
    (category, supabase) =>
      categoriesService.update(category.id || '', category, supabase),
    {
      onMutate: async (updatedCategory: Partial<Category & { id: string }>) => {
        const queryKey = useCategoriesQueryKeys().categories()
        await queryClient.cancelQueries({ queryKey })
        // Snapshot the previous value
        const previousCategories =
          queryClient.getQueryData<Array<Category>>(queryKey)
        // Optimistically update the categories
        queryClient.setQueryData(queryKey, (old: Array<Category>) =>
          old.map((old_category) =>
            old_category.id === updatedCategory.id
              ? updatedCategory
              : old_category,
          ),
        )
        // Return the previous value of the categories to allow for rollback
        return { previousCategories, queryKey }
      },
      onSettled: (_data, error, _variables, context) => {
        if (error) {
          if (context?.previousCategories) {
            queryClient.setQueryData(
              context.queryKey,
              context.previousCategories,
            )
          }
          return
        }

        queryClient.invalidateQueries({
          queryKey: context?.queryKey,
        })
      },
    },
  )
}
