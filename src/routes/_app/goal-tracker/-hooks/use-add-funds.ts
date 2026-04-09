import { useState } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import type { GoalWithProgress } from '@/types/goal.types'
import type { ContributionFormData } from '@/lib/schemas/goal/contribution.schema'
import { useAuthMutation } from '@/hooks/auth/use-auth-mutation'
import { useGoalQueryKeys } from '@/hooks/goal/use-goal-query-keys'
import { transactionsService } from '@/services/transactions.service'
import { toContributionPayload } from '@/lib/schemas/goal/contribution.schema'

export const useAddFunds = () => {
  const [target, setTarget] = useState<GoalWithProgress | null>(null)
  const queryClient = useQueryClient()
  const goalQueryKeys = useGoalQueryKeys()

  const { mutate: createTransaction, isPending } = useAuthMutation(
    (data: ReturnType<typeof toContributionPayload>, supabase) =>
      transactionsService.create(data, supabase),
    {
      onSuccess: () => {
        toast.success('Funds added successfully')
        queryClient.invalidateQueries({ queryKey: goalQueryKeys.goals() })
        setTarget(null)
      },
    },
  )

  const handleSubmit = (data: ContributionFormData) => {
    createTransaction(toContributionPayload(data))
  }

  return {
    target,
    open: target !== null,
    openAddFunds: setTarget,
    close: () => setTarget(null),
    handleSubmit,
    isPending,
  }
}
