import type { SpendingStatus } from '@/lib/colors'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface BudgetCardProgressProps {
  totalSpent: number
  budgetAmount: number
  progressValue: number
  status: SpendingStatus
}

export const BudgetCardProgress = ({
  totalSpent,
  budgetAmount,
  progressValue,
  status,
}: BudgetCardProgressProps) => (
  <div className="mb-4 flex flex-col items-center gap-2">
    <div className="flex w-full items-center justify-between gap-2">
      <p className="text-foreground dark:text-card-text-primary text-xl">
        ${totalSpent}
      </p>
      <p className="text-muted-foreground dark:text-card-text-muted text-sm">
        of ${budgetAmount}
      </p>
    </div>
    <Progress
      value={Math.min(progressValue, 100)}
      className={cn(
        'h-1',
        status === 'over-budget'
          ? '[&>div]:bg-red-500'
          : status === 'near-limit'
            ? '[&>div]:bg-amber-500'
            : '[&>div]:bg-green-500',
      )}
    />
  </div>
)
