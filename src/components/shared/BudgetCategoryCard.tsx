import { Progress } from '../ui/progress'
import { getCategoryStyles } from '@/lib/colors'

export interface BudgetCategoryCardProps {
  amountBudget: number
  amountSpent: number
  category: string
  color: string
  icon: string
}
export const BudgetCategoryCard = ({
  amountBudget,
  amountSpent,
  category,
  color,
  icon,
}: BudgetCategoryCardProps) => {
  const progressValue = (amountSpent / amountBudget) * 100
  const { bg, progress } = getCategoryStyles(color)
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
          <p className="text-base font-semibold uppercase">{category}</p>
        </div>
        <p className="text-muted-foreground font-mono text-sm">
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
