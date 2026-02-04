import type { ComponentType, ReactNode } from 'react'
import type { LucideProps } from 'lucide-react'
import { currencyFormatter } from '@/lib/format'
import { getCategoryStyles } from '@/lib/colors'

export interface ExpenseItemProps {
  amountSpent: number
  category: string
  children?: ReactNode
  color: string
  Icon: ComponentType<LucideProps>
  title: string
}
export const ExpenseItem = ({
  amountSpent,
  category,
  children,
  color,
  Icon,
  title,
}: ExpenseItemProps) => {
  const { text, bg } = getCategoryStyles(color)
  return (
    <div className="w-full space-y-2 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            className="h-10 w-10 rounded-lg p-2"
            style={{ color: text.color, backgroundColor: bg.backgroundColor }}
          />
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
          {currencyFormatter.format(amountSpent)}
        </p>
      </div>
    </div>
  )
}
