import { useExpenseItem } from '@/hooks/use-expense-item'

export const ExpenseItemDetails = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { title, category } = useExpenseItem()
  return (
    <div className="flex flex-col">
      <p className="text-base font-semibold capitalize">{title}</p>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground text-sm capitalize">{category}</p>
        {children}
      </div>
    </div>
  )
}
