import { useGoals } from '@/hooks/goal/use-goals'
import { useCreateGoal } from '@/hooks/goal/use-goal-create'
import { useUpdateGoal } from '@/hooks/goal/use-goal-update'
import { useDeleteGoal } from '@/hooks/goal/use-goal-delete'

export const useGoalsData = () => {
  const { data: goals, isLoading } = useGoals()
  const { mutate: createGoal, isPending: isCreating } = useCreateGoal()
  const { mutate: updateGoal, isPending: isUpdating } = useUpdateGoal()
  const { mutate: deleteGoal, isPending: isDeleting } = useDeleteGoal()

  const activeGoals = goals?.filter((g) => !g.is_achieved) ?? []
  const achievedGoals = goals?.filter((g) => g.is_achieved) ?? []

  return {
    goals,
    activeGoals,
    achievedGoals,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
