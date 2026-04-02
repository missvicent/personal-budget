import type { BudgetBadge } from '@/routes/_app/budget/-hooks/budget-card/use-budget-card-display'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface BudgetCardBadgesProps {
  badges: Array<BudgetBadge>
}

export const BudgetCardBadges = ({ badges }: BudgetCardBadgesProps) => (
  <div className="mb-6 flex items-center gap-2">
    {badges.map((badge) => (
      <Badge
        key={badge.label}
        variant="outline"
        className={cn(
          badge.color.text,
          badge.color.bg,
          badge.color.border,
          'border',
        )}
      >
        {badge.label}
      </Badge>
    ))}
  </div>
)
