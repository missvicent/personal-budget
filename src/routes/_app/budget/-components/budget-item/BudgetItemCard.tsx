import type { BudgetItem } from '@/types/budget.types'
import { Card, CardContent } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'

interface BudgetItemCardProps {
  budgetItem: BudgetItem
}

export const BudgetItemCard = ({ budgetItem }: BudgetItemCardProps) => {
  const { category_name, amount, category_icon, category_color } = budgetItem
  const budgetAmount = budgetItem.budget_amount ?? 0
  const progressValue = budgetAmount > 0 ? (amount / budgetAmount) * 100 : 0

  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="flex flex-col gap-3">
          <CircularProgress
            value={progressValue}
            size={64}
            strokeWidth={5}
            color={category_color ?? 'var(--color-primary)'}
          >
            <span className="text-xl">{category_icon}</span>
          </CircularProgress>
          <div>
            <p className="font-semibold">{category_name}</p>
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">${amount}</span>{' '}
              of ${budgetAmount}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{Math.round(progressValue)}%</p>
          <p className="text-muted-foreground text-xs">of budget</p>
        </div>
      </CardContent>
    </Card>
  )
}
