import type { GoalWithProgress } from '@/types/goal.types'
import { DeleteDialog } from '@/components/shared/DeleteDialog'
import { currencyFormatter } from '@/lib/format'

interface GoalDeleteDialogProps {
  deleteTarget: GoalWithProgress | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
  open: boolean
}

export const GoalDeleteDialog = ({
  deleteTarget,
  isDeleting,
  onCancel,
  onConfirm,
  open,
}: GoalDeleteDialogProps) => {
  const hasContributions = deleteTarget && deleteTarget.current_amount > 0

  return (
    <DeleteDialog
      open={open}
      title="Delete Goal"
      onConfirm={onConfirm}
      onCancel={() => {
        if (!isDeleting) onCancel()
      }}
      isDeleting={isDeleting}
    >
      {deleteTarget && (
        <>
          Are you sure you want to delete &quot;{deleteTarget.name}&quot;?
          {hasContributions && (
            <>
              {' '}
              This goal has{' '}
              {currencyFormatter.format(deleteTarget.current_amount)} in
              contributions. The transactions will remain but will no longer be
              linked to a goal.
            </>
          )}
        </>
      )}
    </DeleteDialog>
  )
}
