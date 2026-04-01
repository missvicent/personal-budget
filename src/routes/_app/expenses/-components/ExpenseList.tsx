import { useState } from 'react'
import { currencyFormatter } from '@/lib/format'
import { DeleteDialog } from '@/components/shared/DeleteDialog'
import { ExpenseItem } from '@/components/shared/ExpenseItem'
import { CardActions } from '@/components/shared/CardActions'

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
              <div key={transaction.id}>
                <ExpenseItem
                  amount={transaction.amount}
                  category={transaction.name}
                  color={transaction.color}
                  icon={transaction.icon}
                  isOverBudget={overspendingIds.has(transaction.id)}
                  title={transaction.description}
                >
                  <div className="flex items-center gap-2">
                    <ExpenseItem.Icon />
                    <ExpenseItem.Details />
                  </div>
                  <div className="flex items-center gap-2">
                    <ExpenseItem.Actions>
                      <CardActions
                        onEdit={() => onEdit(transaction)}
                        onDelete={() => setDeleteTarget(transaction)}
                        showOnHover={false}
                      />
                    </ExpenseItem.Actions>
                    <ExpenseItem.Amount />
                  </div>
                </ExpenseItem>
              </div>
            ))}
          </div>
        </div>
      ))}
      <DeleteDialog
        open={deleteTarget !== null}
        title="Delete Expense"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null)
        }}
        isDeleting={isDeleting}
      >
        {deleteTarget && (
          <>
            Are you sure you want to delete {deleteTarget.description} for{' '}
            {currencyFormatter.format(deleteTarget.amount)}? This action cannot
            be undone.
          </>
        )}
      </DeleteDialog>
    </section>
  )
}
