import { useExpenseItem } from '@/hooks/use-expense-item'

export const ExpenseItemDetails = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  const { title, category } = useExpenseItem()
  return (
    <div className="flex flex-col gap-1">
      <p className="group-hover:text-primary text-sm font-semibold capitalize transition-colors duration-200">
        {title}
      </p>
      <div className="flex items-center">
        <p className="text-muted-foreground text-xs capitalize">{category}</p>
        {children}
      </div>
    </div>
  )
}
