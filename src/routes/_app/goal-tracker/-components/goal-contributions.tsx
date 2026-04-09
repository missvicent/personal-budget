import type { GoalWithProgress } from '@/types/goal.types'
import { currencyFormatter } from '@/lib/format'
import { Progress } from '@/components/ui/progress'

interface GoalContributionsProps {
  goal: GoalWithProgress
}

export const GoalContributions = ({ goal }: GoalContributionsProps) => {
  const total = goal.budget_contributions + goal.direct_contributions
  const budgetPercent =
    total > 0 ? (goal.budget_contributions / total) * 100 : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">From budgets</span>
        <span className="font-medium">
          {currencyFormatter.format(goal.budget_contributions)}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Direct income</span>
        <span className="font-medium">
          {currencyFormatter.format(goal.direct_contributions)}
        </span>
      </div>
      <Progress value={budgetPercent} className="h-2" />
      <p className="text-muted-foreground text-xs">
        {Math.round(budgetPercent)}% from budgets,{' '}
        {Math.round(100 - budgetPercent)}% direct
      </p>
    </div>
  )
}
