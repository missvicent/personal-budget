import { GoalForm } from './goal-form'
import type { GoalFormData } from '@/lib/schemas/goal/goal.schema'
import type { GoalWithProgress } from '@/types/goal.types'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'

interface GoalDialogProps {
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: GoalFormData) => void
  open: boolean
  selectedGoal: GoalWithProgress | null
}

export const GoalDialog = ({
  isPending,
  onOpenChange,
  onSubmit,
  open,
  selectedGoal,
}: GoalDialogProps) => {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <GoalForm
        key={selectedGoal?.id ?? 'new'}
        isPending={isPending}
        onSubmit={onSubmit}
        selectedGoal={selectedGoal}
      />
    </ResponsiveDialog>
  )
}
