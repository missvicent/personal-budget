import { KpiCard } from './KpiCard'
import { CircularProgress } from '@/components/ui/circular-progress'
import { currencyFormatter } from '@/lib/format'

type PacingCardProps = {
  utilizationPct: number
  diff: number
  isOver: boolean
  budget: number
  isLoading?: boolean
}

export const PacingCard = ({
  utilizationPct,
  diff,
  isOver,
  budget,
  isLoading,
}: PacingCardProps) => {
  const hasBudget = budget > 0
  const ringValue = Math.min(utilizationPct, 100)
  const ringColor = isOver ? 'var(--destructive)' : 'var(--color-primary)'

  return (
    <KpiCard
      label="PACING"
      isLoading={isLoading}
      value={hasBudget ? `${Math.round(utilizationPct)}%` : '—'}
      subText={
        hasBudget ? (
          <span className={isOver ? 'text-destructive' : undefined}>
            {currencyFormatter.format(diff)}{' '}
            {isOver ? 'over budget' : 'under budget'}
          </span>
        ) : (
          <span className="text-muted-foreground">Set a budget amount</span>
        )
      }
      viz={
        hasBudget ? (
          <div className="flex justify-end">
            <CircularProgress
              value={ringValue}
              size={36}
              strokeWidth={4}
              color={ringColor}
            />
          </div>
        ) : null
      }
    />
  )
}
