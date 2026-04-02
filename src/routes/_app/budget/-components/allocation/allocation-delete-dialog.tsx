import type { BudgetWithProgress } from '@/types/budget.types'
import { DeleteDialog } from '@/components/shared/DeleteDialog'
import { currencyFormatter } from '@/lib/format'

interface DialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
  deleteTarget: BudgetWithProgress | null
}

export const AllocationDeleteDialog = ({
  open,
  onConfirm,
  onCancel,
  isDeleting,
  deleteTarget,
}: DialogProps) => {
  return (
    <DeleteDialog
      open={open}
      title="Delete Expense"
      onConfirm={onConfirm}
      onCancel={() => {
        if (!isDeleting) onCancel()
      }}
      isDeleting={isDeleting}
    >
      {deleteTarget && (
        <>
          Are you sure you want to delete {deleteTarget.category_name} for{' '}
          {currencyFormatter.format(deleteTarget.amount)}? This action cannot be
          undone.
        </>
      )}
    </DeleteDialog>
  )
}
