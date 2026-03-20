import type { BadgeColor } from '@/lib/colors'
import {
  getSpendingStatus,
  lifecycleColors,
  periodColors,
  spendingColors,
} from '@/lib/colors'
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

type BudgetBadge = { label: string; color: BadgeColor }

export interface BudgetItemProps {
  name?: string
  year?: string
  dateRange?: string
  amountSpent?: number
  amountBudget?: number
  daysLeft?: number
  badges?: Array<BudgetBadge>
}

export const BudgetItem = ({
  name = 'Groceries',
  year = '2026',
  dateRange = 'Mar 1, 2026 - Mar 31, 2026',
  amountSpent = 50,
  amountBudget = 100,
  daysLeft = 15,
  badges = [
    { label: 'active', color: lifecycleColors['active'] },
    { label: 'monthly', color: periodColors['monthly'] },
  ],
}: BudgetItemProps) => {
  const progressValue =
    amountBudget > 0 ? (amountSpent / amountBudget) * 100 : 0
  const status = getSpendingStatus(amountSpent, amountBudget)
  const allBadges: Array<BudgetBadge> = [
    ...badges,
    { label: status, color: spendingColors[status] },
  ]

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="py-2">
        <CardTitle className="text-lg font-bold">{name}</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col px-6">
        <span className="text-muted-foreground dark:text-card-text-secondary mb-3 text-sm">
          {dateRange}
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
              ${amountSpent}
            </p>
            <p className="text-muted-foreground dark:text-card-text-muted text-sm">
              of ${amountBudget}
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
          {daysLeft}
        </span>
        <span className="text-muted-foreground dark:text-card-text-muted text-xs">
          days left
        </span>
      </CardContent>
    </Card>
  )
}
