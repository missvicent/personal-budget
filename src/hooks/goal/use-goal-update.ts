import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useGoalQueryKeys } from './use-goal-query-keys'
import type { Goal } from '@/types/database.types'
import { goalService } from '@/services/goal.service'

export const useUpdateGoal = () => {
  const queryClient = useQueryClient()
  const queryKeys = useGoalQueryKeys()

  return useAuthMutation(
    ({ id, ...goal }: { id: string } & Partial<Goal>, supabase) =>
      goalService.update(id, goal, supabase),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.goals() })
      },
    },
  )
}
