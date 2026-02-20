import { useState } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { currencyFormatter } from '@/lib/format'
import { DeleteDialog } from '@/components/shared/DeleteDialog'
import { ExpenseItem } from '@/components/shared/ExpenseItem'

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
}

export const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
  isDeleting,
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
          <div className="flex items-center justify-between">
            <p className="text-foreground text-base font-semibold capitalize">
              {expense.date}
            </p>
            <p className="text-muted-foreground pr-4 text-base font-semibold">
              {currencyFormatter.format(expense.totalAmount)}
            </p>
          </div>
          <div>
            {expense.transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <ExpenseItem
                  amount={transaction.amount}
                  category={transaction.name}
                  color={transaction.color}
                  icon={transaction.icon}
                  title={transaction.description}
                >
                  <div className="flex items-center gap-2">
                    <ExpenseItem.Icon />
                    <ExpenseItem.Details />
                  </div>
                  <div className="flex items-center gap-2">
                    <ExpenseItem.Amount />
                    <ExpenseItem.Actions>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/20 hover:text-primary/70"
                        onClick={() => onEdit(transaction)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/20 hover:text-destructive/70"
                        onClick={() => setDeleteTarget(transaction)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </ExpenseItem.Actions>
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
