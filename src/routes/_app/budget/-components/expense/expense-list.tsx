import { useState } from 'react'
import { Expense } from './expense'
import { ExpenseDeleteDialog } from './expense-delete-dialog'
import { currencyFormatter } from '@/lib/format'

export interface ExpenseTransaction {
  amount: number
  category_id: string
  color: string
  description: string
  icon: string
  id: string
  is_recurring: boolean
  name: string
  transaction_date: string
}

export interface ExpenseRecord {
  id: string
  date: string
  totalAmount: number
  transactions: Array<ExpenseTransaction>
}

export interface ExpenseListProps {
  expenses: Array<ExpenseRecord>
  onEdit: (transaction: ExpenseTransaction) => void
  onDelete: (id: string, onSuccess: () => void) => void
  isDeleting: boolean
  overspendingIds: Set<string>
}

export const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
  isDeleting,
  overspendingIds,
}: ExpenseListProps) => {
  const [deleteTarget, setDeleteTarget] = useState<ExpenseTransaction | null>(
    null,
  )

  if (expenses.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-base">No expenses found</p>
      </section>
    )
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    onDelete(deleteTarget.id, () => setDeleteTarget(null))
  }

  return (
    <section>
      {expenses.map((expense) => (
        <div key={expense.id} className="py-2">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-foreground text-base font-semibold capitalize">
              {expense.date}
            </p>
            <p className="text-foreground pr-4 text-base font-semibold">
              {currencyFormatter.format(expense.totalAmount)}
            </p>
          </div>
          <div className="mb-2 grid grid-cols-1 gap-2 xl:grid-cols-2 2xl:grid-cols-3">
            {expense.transactions.map((transaction) => (
              <Expense
                key={transaction.id}
                transaction={transaction}
                overspendingIds={overspendingIds}
                onEdit={onEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        </div>
      ))}
      <ExpenseDeleteDialog
        open={deleteTarget !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
        deleteTarget={deleteTarget}
      />
    </section>
  )
}
