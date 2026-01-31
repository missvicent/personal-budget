import { Progress } from '../ui/progress'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { getCategoryStyles } from '@/lib/colors'

export interface BudgetCategoryCardProps {
  amountBudget: number
  amountSpent: number
  category: string
  color: string
  Icon: ComponentType<LucideProps>
}
export const BudgetCategoryCard = ({
  amountBudget,
  amountSpent,
  category,
  color,
  Icon,
}: BudgetCategoryCardProps) => {
  const progressValue = (amountSpent / amountBudget) * 100
  const { text, bg, progress } = getCategoryStyles(color)
  return (
    <div className="w-full space-y-2 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            className="h-10 w-10 rounded-lg p-2"
            style={{ color: text.color, backgroundColor: bg.backgroundColor }}
          />
          <p className="text-base font-semibold uppercase">{category}</p>
        </div>
        <p className="text-muted-foreground text-sm">
          ${amountSpent}/ ${amountBudget}
        </p>
      </div>

      <Progress
        value={Math.min(progressValue, 100)}
        style={
          {
            '--progress-color': progress.backgroundColor,
          } as React.CSSProperties
        }
        className={
          progressValue > 100
            ? '[&>div]:bg-destructive'
            : '[&>div]:bg-(--progress-color)'
        }
      />
    </div>
  )
}
