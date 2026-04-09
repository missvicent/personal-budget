import { useAuthQuery } from '../auth/use-auth-query'
import { useGoalQueryKeys } from './use-goal-query-keys'
import type { GoalWithProgress } from '@/types/database.types'
import { goalService } from '@/services/goal.service'

export const useGoals = () => {
  return useAuthQuery<Array<GoalWithProgress>>(
    useGoalQueryKeys().goals(),
    async (supabase) => {
      try {
        return await goalService.getAllWithProgress(supabase)
      } catch {
        return []
      }
    },
    { retry: false },
  )
}
