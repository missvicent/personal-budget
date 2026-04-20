import type { SpotlightCategory } from '@/routes/_app/budget/-hooks/dashboard/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { currencyFormatter } from '@/lib/format'

export interface SpotlightCategoryCardProps {
  spotlight: SpotlightCategory | null
}

export const SpotlightCategoryCard = ({
  spotlight,
}: SpotlightCategoryCardProps) => {
  if (spotlight === null) {
    return (
      <Card data-testid="spotlight-category-card">
        <CardHeader>
          <p className="text-base font-semibold uppercase">Spotlight</p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No categories yet</p>
        </CardContent>
      </Card>
    )
  }

  const { mode, name, icon, amountSpent, amountBudget, overshoot } = spotlight
  const isOutlier = mode === 'outlier'

  return (
    <Card
      data-testid="spotlight-category-card"
      className={cn(
        isOutlier && 'border-destructive dark:border-destructive border-l-4',
      )}
    >
      <CardHeader className="flex flex-row items-center gap-3">
        <span className="text-2xl" aria-hidden>
          {icon}
        </span>
        <div>
          <p className="text-muted-foreground text-xs uppercase">
            {isOutlier ? 'Over in' : 'Top'}
          </p>
          <p className="text-base font-semibold">{name}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2 font-mono text-2xl font-bold">
          {isOutlier
            ? `+${currencyFormatter.format(overshoot)}`
            : currencyFormatter.format(amountSpent)}
        </p>
        <p className="text-muted-foreground text-xs">
          {isOutlier
            ? `over ${currencyFormatter.format(amountBudget)}`
            : `of ${currencyFormatter.format(amountBudget)}`}
        </p>
      </CardContent>
    </Card>
  )
}
