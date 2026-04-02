import type { ExpenseTransaction } from './expense-list'
import { DeleteDialog } from '@/components/shared/DeleteDialog'
import { currencyFormatter } from '@/lib/format'

interface ExpenseDeleteDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
  deleteTarget: ExpenseTransaction | null
}

export const ExpenseDeleteDialog = ({
  open,
  onConfirm,
  onCancel,
  isDeleting,
  deleteTarget,
}: ExpenseDeleteDialogProps) => {
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
          Are you sure you want to delete {deleteTarget.description} for{' '}
          {currencyFormatter.format(deleteTarget.amount)}? This action cannot be
          undone.
        </>
      )}
    </DeleteDialog>
  )
}
