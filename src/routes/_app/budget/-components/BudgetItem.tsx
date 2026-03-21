import { parseISO } from 'date-fns'

import type { BadgeColor } from '@/lib/colors'
import type { BudgetOverview } from '@/types/database.types'
import { getSpendingStatus, periodColors, spendingColors } from '@/lib/colors'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { leftDays } from '@/lib/dates/leftDays'
import { formatDateRange, formatYear } from '@/lib/dates/formatDate'

type BudgetBadge = { label: string; color: BadgeColor }

export interface BudgetItemProps {
  budget: BudgetOverview
}

export const BudgetItem = ({ budget }: BudgetItemProps) => {
  const {
    budget_amount,
    budget_name,
    period,
    start_date,
    end_date,
    total_spent,
  } = budget

  const progressValue =
    budget_amount > 0 ? (total_spent / budget_amount) * 100 : 0

  const status = getSpendingStatus(total_spent, budget_amount)

  const allBadges: Array<BudgetBadge> = [
    { label: status, color: spendingColors[status] },
    { label: period, color: periodColors[period] },
  ]

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="py-2">
        <CardTitle className="text-lg font-bold">{budget_name}</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          {formatYear(parseISO(start_date))}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col px-6">
        <span className="text-muted-foreground dark:text-card-text-secondary mb-3 text-sm">
          {formatDateRange(parseISO(start_date), parseISO(end_date ?? ''))}
        </span>
        <div className="mb-6 flex items-center gap-2">
          {allBadges.map((badge) => (
            <Badge
              key={badge.label}
              variant="outline"
              className={cn(
                badge.color.text,
                badge.color.bg,
                badge.color.border,
                'border-1',
              )}
            >
              {badge.label}
            </Badge>
          ))}
        </div>
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="flex w-full items-center justify-between gap-2">
            <p className="text-foreground dark:text-card-text-primary text-xl">
              ${total_spent}
            </p>
            <p className="text-muted-foreground dark:text-card-text-muted text-sm">
              of ${budget_amount}
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
        <span className="text-foreground dark:text-card-text-primary text-lg font-bold">
          {leftDays(new Date(end_date ?? ''))}
        </span>
        <span className="text-muted-foreground dark:text-card-text-muted text-xs">
          days left
        </span>
      </CardContent>
    </Card>
  )
}
