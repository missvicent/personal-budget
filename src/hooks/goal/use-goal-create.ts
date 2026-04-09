import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useGoalQueryKeys } from './use-goal-query-keys'
import type { Goal } from '@/types/database.types'
import { goalService } from '@/services/goal.service'

export const useCreateGoal = () => {
  const queryClient = useQueryClient()
  const queryKeys = useGoalQueryKeys()

  return useAuthMutation(
    (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>, supabase) =>
      goalService.create(goal, supabase),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.goals() })
      },
    },
  )
}
