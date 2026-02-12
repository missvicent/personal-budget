import { useExpenseItem } from '@/hooks/use-expense-item'
import { getCategoryStyles } from '@/lib/colors'

export const ExpenseItemIcon = () => {
  const { icon, color } = useExpenseItem()
  const { bg } = getCategoryStyles(color)
  return (
    <span
      className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
      style={{ backgroundColor: bg.backgroundColor }}
    >
      {icon}
    </span>
  )
}
