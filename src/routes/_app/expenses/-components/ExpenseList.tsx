import { PencilIcon, Trash2Icon } from 'lucide-react'
import { currencyFormatter } from '@/lib/format'
import { ExpenseItem } from '@/components/shared/ExpenseItem'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export interface ExpenseTransaction {
  amount: number
  category: string
  color: string
  date: string
  icon: string
  id: string
  title: string
}

export interface ExpenseRecord {
  id: string
  date: string
  totalAmount: number
  transactions: Array<ExpenseTransaction>
}

export interface ExpenseListProps {
  expenses: Array<ExpenseRecord>
}

export const ExpenseList = ({ expenses }: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-base">No expenses found</p>
      </section>
    )
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
          <div className="bg-sidebar mt-3 rounded-lg border px-4 py-3">
            {expense.transactions.map((transaction, index) => (
              <div key={transaction.id}>
                {index > 0 && <Separator />}
                <ExpenseItem
                  amount={transaction.amount}
                  category={transaction.category}
                  color={transaction.color}
                  icon={transaction.icon}
                  title={transaction.title}
                >
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/20 hover:text-primary/70"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/20 hover:text-destructive/70"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </ExpenseItem>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
