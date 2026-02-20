export const ExpenseItemActions = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {children}
    </div>
  )
}
