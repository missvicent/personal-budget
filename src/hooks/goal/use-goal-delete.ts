import { useQueryClient } from '@tanstack/react-query'
import { useAuthMutation } from '../auth/use-auth-mutation'
import { useGoalQueryKeys } from './use-goal-query-keys'
import type { GoalWithProgress } from '@/types/database.types'
import { goalService } from '@/services/goal.service'

export const useDeleteGoal = () => {
  const queryClient = useQueryClient()
  const queryKeys = useGoalQueryKeys()

  return useAuthMutation(
    (id: string, supabase) => goalService.delete(id, supabase),
    {
      onMutate: async (id: string) => {
        await queryClient.cancelQueries({ queryKey: queryKeys.goals() })
        const previous = queryClient.getQueryData<Array<GoalWithProgress>>(
          queryKeys.goals(),
        )
        queryClient.setQueryData(
          queryKeys.goals(),
          (old: Array<GoalWithProgress> | undefined) =>
            old?.filter((g) => g.id !== id) ?? [],
        )
        return { previous }
      },
      onSettled: (_data, error, _id, context) => {
        if (error && context?.previous) {
          queryClient.setQueryData(queryKeys.goals(), context.previous)
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.goals() })
      },
    },
  )
}
