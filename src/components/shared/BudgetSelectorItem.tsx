export const BudgetSelectorItem = ({
  label,
  description,
  color,
  icon,
}: {
  label: string
  description: string
  color: string
  icon: string
}) => {
  return (
    <div className="flex w-full min-w-0 flex-row items-center justify-between gap-2">
      <div className="flex min-w-0 flex-row items-center gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-white transition-all duration-200 group-hover:scale-110"
          style={{ backgroundColor: color || 'var(--grey-300)' }}
        >
          {icon}
        </span>
        <span className="truncate text-sm font-medium">{label}</span>
      </div>
      {description && (
        <div className="flex min-w-0 flex-row items-center justify-end gap-2">
          <span className="truncate">{description}</span>
        </div>
      )}
    </div>
  )
}
