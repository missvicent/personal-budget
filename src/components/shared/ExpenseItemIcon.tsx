import { useExpenseItem } from '@/hooks/use-expense-item'
import { getCategoryStyles } from '@/lib/colors'

export const ExpenseItemIcon = () => {
  const { icon, color } = useExpenseItem()
  const { bg } = getCategoryStyles(color)
  return (
    <span
      className="flex h-13 w-13 items-center justify-center rounded-lg text-lg transition-all duration-200 group-hover:scale-110"
      style={{ backgroundColor: bg.backgroundColor }}
    >
      {icon}
    </span>
  )
}
