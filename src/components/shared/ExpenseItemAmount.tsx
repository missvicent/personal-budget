import { currencyFormatter } from '@/lib/format'
import { useExpenseItem } from '@/hooks/use-expense-item'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const ExpenseItemAmount = () => {
  const { amount, isOverBudget } = useExpenseItem()
  return (
    <div className="flex flex-col items-end gap-0.5">
      {isOverBudget && (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20 border px-1.5 py-0 text-[10px]">
          Over budget
        </Badge>
      )}
      <p
        className={cn(
          'text-foreground px-2 text-sm font-medium',
          isOverBudget && 'text-destructive',
        )}
      >
        {currencyFormatter.format(amount)}
      </p>
    </div>
  )
}
