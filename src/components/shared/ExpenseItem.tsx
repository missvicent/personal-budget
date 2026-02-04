import type { ReactNode } from 'react'
import { currencyFormatter } from '@/lib/format'
import { getCategoryStyles } from '@/lib/colors'

export interface ExpenseItemProps {
  amount: number
  category: string
  children?: ReactNode
  color: string
  icon: string
  title: string
}
export const ExpenseItem = ({
  amount,
  category,
  children,
  color,
  icon,
  title,
}: ExpenseItemProps) => {
  const { bg } = getCategoryStyles(color)
  return (
    <div className="w-full space-y-2 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
            style={{ backgroundColor: bg.backgroundColor }}
          >
            {icon}
          </span>
          <div className="flex flex-col">
            <p className="text-base font-semibold capitalize">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm capitalize">
                {category}
              </p>
              {children}
            </div>
          </div>
        </div>
        <p className="text-foreground text-base font-semibold">
          {currencyFormatter.format(amount)}
        </p>
      </div>
    </div>
  )
}
