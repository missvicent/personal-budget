import { useState } from 'react'
import type { ExpenseTransaction } from '../../-components/expense/expense-list'

export const useExpenseDialog = () => {
  const [open, setOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<ExpenseTransaction | null>(null)

  return {
    onEdit: (transaction: ExpenseTransaction) => {
      setOpen(true)
      setSelectedTransaction(transaction)
    },
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) setSelectedTransaction(null)
    },
    selectedTransaction,
    open,
  }
}
