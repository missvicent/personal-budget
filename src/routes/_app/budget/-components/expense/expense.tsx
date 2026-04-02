import type { ExpenseTransaction } from './expense-list'
import { CardActions } from '@/components/shared/CardActions'
import { ExpenseItem } from '@/components/shared/ExpenseItem'

interface ExpenseProps {
  transaction: ExpenseTransaction
  overspendingIds: Set<string>
  onEdit: (transaction: ExpenseTransaction) => void
  onDelete: (transaction: ExpenseTransaction) => void
}

export const Expense = ({
  transaction,
  overspendingIds,
  onEdit,
  onDelete,
}: ExpenseProps) => {
  return (
    <div>
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
              onDelete={() => onDelete(transaction)}
              showOnHover={false}
            />
          </ExpenseItem.Actions>
          <ExpenseItem.Amount />
        </div>
      </ExpenseItem>
    </div>
  )
}
