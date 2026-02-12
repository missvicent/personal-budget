import { currencyFormatter } from '@/lib/format'
import { useExpenseItem } from '@/hooks/use-expense-item'

export const ExpenseItemAmount = () => {
  const { amount } = useExpenseItem()
  return (
    <p className="text-foreground px-2 text-base font-semibold">
      {currencyFormatter.format(amount)}
    </p>
  )
}
