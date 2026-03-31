import { currencyFormatter } from '@/lib/format'
import { useExpenseItem } from '@/hooks/use-expense-item'
import { Badge } from '@/components/ui/badge'

export const ExpenseItemAmount = () => {
  const { amount, isOverBudget } = useExpenseItem()
  return (
    <div className="flex items-center gap-2">
      {isOverBudget && (
        <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
          Over budget
        </Badge>
      )}
      <p className="text-foreground px-2 text-lg font-medium">
        {currencyFormatter.format(amount)}
      </p>
    </div>
  )
}
