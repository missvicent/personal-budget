import { PlusIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { GoalWithProgress } from '@/types/goal.types'
import { CardActions } from '@/components/shared/CardActions'
import { Card, CardContent } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/circular-progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { currencyFormatter } from '@/lib/format'
import {
  getGoalProgressPercent,
  getGoalStatus,
  getOverflowAmount,
  getProjectedCompletionDate,
} from '@/lib/goal.utils'

interface GoalCardProps {
  goal: GoalWithProgress
  onAddFunds: () => void
  onDelete: () => void
  onEdit: () => void
}

const statusBadgeVariants: Record<
  string,
  { label: string; className: string }
> = {
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  achieved: {
    label: 'Achieved',
    className: 'bg-green-500/10 text-green-600 border-green-500/20',
  },
  overflowed: {
    label: 'Overflowed',
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
}

export const GoalCard = ({
  goal,
  onAddFunds,
  onDelete,
  onEdit,
}: GoalCardProps) => {
  const status = getGoalStatus(goal)
  const progressPercent = getGoalProgressPercent(goal)
  const overflow = getOverflowAmount(goal)
  const projectedDate = getProjectedCompletionDate(goal)
  const badge = statusBadgeVariants[status]
  const progressColor =
    status === 'in_progress' ? 'var(--chart-4)' : 'var(--chart-2)'

  return (
    <Card
      className="rounded-2xl border-l-4 pt-4"
      style={{ borderLeftColor: progressColor }}
    >
      <CardContent className="flex flex-col gap-4 px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CircularProgress
              value={progressPercent}
              size={64}
              strokeWidth={5}
              color={progressColor}
            >
              <span className="text-xl">🎯</span>
            </CircularProgress>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{goal.name}</p>
                <Badge
                  variant="outline"
                  className={cn('border text-xs', badge.className)}
                >
                  {badge.label}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-semibold">
                  {currencyFormatter.format(goal.current_amount)}
                </span>{' '}
                of {currencyFormatter.format(goal.target_amount)}
              </p>
              {overflow > 0 && (
                <p className="text-xs text-amber-600">
                  +{currencyFormatter.format(overflow)} over target
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-2xl font-bold">{Math.round(progressPercent)}%</p>
            <p className="text-muted-foreground text-xs">saved</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex flex-col gap-0.5 text-xs">
            {goal.target_date && (
              <span>
                Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}
              </span>
            )}
            {projectedDate && <span>Projected: {projectedDate}</span>}
            <span>
              Budget: {currencyFormatter.format(goal.budget_contributions)} |
              Direct: {currencyFormatter.format(goal.direct_contributions)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onAddFunds}
              className="gap-1"
            >
              <PlusIcon className="h-3 w-3" /> Add Funds
            </Button>
            <CardActions
              deleteDisabled={false}
              onEdit={onEdit}
              onDelete={onDelete}
              showOnHover={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
