import type { ExpenseTransaction } from '../../-components/expense/expense-list'
import type { ExpenseFormData } from '@/lib/schemas/expenses/expense.schema'
import { useCreateTransaction } from '@/hooks/transactions/use-create-transaction'
import { useUpdateTransaction } from '@/hooks/transactions/use-update-transaction'
import { useDeleteTransaction } from '@/hooks/transactions/use-delete-transaction'
import { toTransactionPayload } from '@/lib/schemas/expenses/expense.schema'

export const useExpenseActions = (
  onSuccess: () => void,
  budgetId?: string,
  ensureBudgetItem?: (categoryId: string, amount: number) => Promise<void>,
  fallbackCategoryId?: string,
) => {
  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction()
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction(budgetId)
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction()

  const onSubmit = async (
    data: ExpenseFormData,
    selectedTransaction: ExpenseTransaction | null,
  ) => {
    if (data.category_id && ensureBudgetItem) {
      await ensureBudgetItem(data.category_id, data.amount)
    }

    if (selectedTransaction) {
      updateTransaction(
        {
          ...toTransactionPayload(data, budgetId, fallbackCategoryId),
          id: selectedTransaction.id,
        },
        { onSuccess },
      )
    } else {
      createTransaction(
        toTransactionPayload(data, budgetId, fallbackCategoryId),
        { onSuccess },
      )
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
