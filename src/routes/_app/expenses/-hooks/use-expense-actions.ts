import type { ExpenseTransaction } from '../-components/ExpenseList'
import type { ExpenseFormData } from '@/lib/schemas/expenses/expense.schema'
import { useCreateTransaction } from '@/hooks/transactions/use-create-transaction'
import { useUpdateTransaction } from '@/hooks/transactions/use-update-transaction'
import { useDeleteTransaction } from '@/hooks/transactions/use-delete-transaction'
import { toTransactionPayload } from '@/lib/schemas/expenses/expense.schema'

export const useExpenseActions = (onSuccess: () => void) => {
  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction()
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction()
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction()

  const onSubmit = (
    data: ExpenseFormData,
    selectedTransaction: ExpenseTransaction | null,
  ) => {
    if (selectedTransaction) {
      updateTransaction(
        { ...toTransactionPayload(data), id: selectedTransaction.id },
        { onSuccess },
      )
    } else {
      createTransaction(toTransactionPayload(data), { onSuccess })
    }
  }

  const onDelete = (id: string, onDeleteSuccess: () => void) =>
    deleteTransaction(id, { onSuccess: onDeleteSuccess })

  return {
    isCreating,
    isDeleting,
    isUpdating,
    onDelete,
    onSubmit,
  }
}
