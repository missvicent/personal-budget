import { SpentCard } from './period-kpis/SpentCard'
import { PacingCard } from './period-kpis/PacingCard'
import { AvgDayCard } from './period-kpis/AvgDayCard'
import { DaysLeftCard } from './period-kpis/DaysLeftCard'
import { usePeriodKpis } from '@/hooks/insights/use-period-kpis'

type PeriodKpiGridProps = {
  budgetId: string
}

export const PeriodKpiGrid = ({ budgetId }: PeriodKpiGridProps) => {
  const { spent, pacing, avgDay, cycle, isLoading } = usePeriodKpis(budgetId)

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SpentCard
        actual={spent.actual}
        budget={spent.budget}
        deltaPct={spent.deltaPct}
        daily={spent.daily}
        isLoading={isLoading}
      />
      <PacingCard
        utilizationPct={pacing.utilizationPct}
        diff={pacing.diff}
        isOver={pacing.isOver}
        budget={spent.budget}
        isLoading={isLoading}
      />
      <AvgDayCard
        actual={avgDay.actual}
        target={avgDay.target}
        diff={avgDay.diff}
        daily={avgDay.daily}
        isLoading={isLoading}
      />
      <DaysLeftCard
        daysLeft={cycle.daysLeft}
        daily={spent.daily}
        isLoading={isLoading}
      />
    </div>
  )
}
