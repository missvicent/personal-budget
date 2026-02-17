import { useAuthQuery } from '../auth/use-auth-query'
import { useCategoriesQueryKeys } from './use-categories-query-keys'
import type { Category } from '@/types/database.types'
import { categoriesService } from '@/services/categories.service'

export const useCategories = () => {
  return useAuthQuery<Array<Category>>(
    useCategoriesQueryKeys().categories(),
    (supabase) => categoriesService.getAll(supabase),
    {
      retry: false,
    },
  )
}
