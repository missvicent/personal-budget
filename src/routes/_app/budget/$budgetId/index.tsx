import { createFileRoute, useParams } from '@tanstack/react-router'
import { RecentActivity } from '../-components/dashboard/recent-activity'
import { SpendingByCategory } from '../-components/dashboard/spending-by-category'
import { BurnChart } from '../-components/dashboard/burn-chart'
import { DashboardSkeleton } from '../-components/dashboard/dashboard-skeleton'
import { SpotlightCategoryCard } from '../-components/dashboard/spotlight-category-card'
import { useDashboardData } from '../-hooks/dashboard/use-dashboard-data'
import type { DashboardSummary } from '../-hooks/dashboard/types'
import type { StatCardProps } from '@/components/shared/StatCard'
import { StatCard } from '@/components/shared/StatCard'
import { currencyFormatter } from '@/lib/format'

export const Route = createFileRoute('/_app/budget/$budgetId/')({
  component: DashboardPage,
})

const PERIOD_DESCRIPTION: Record<DashboardSummary['periodState'], string> = {
  'not-started': 'Period has not started',
  active: 'This period',
  ended: 'Period ended',
}

type PacePreset = {
  description: string | null // null → fall back to PERIOD_DESCRIPTION
  tone?: StatCardProps['tone']
}

const PACE_PRESET: Record<DashboardSummary['paceState'], PacePreset> = {
  'no-data': { description: null },
  over: { description: 'over pace', tone: 'warning' },
  under: { description: 'under pace' },
  on: { description: 'on pace' },
}

const buildPaceItem = (summary: DashboardSummary): StatCardProps => {
  const preset = PACE_PRESET[summary.paceState]
  const fallback =
    summary.periodState === 'active'
      ? 'No spending yet'
      : PERIOD_DESCRIPTION[summary.periodState]
  return {
    title: 'Pace Variance',
    symbol: '$',
    amountSpent: summary.paceVariance ?? 0,
    tone: preset.tone,
    additionalDescription: preset.description ?? fallback,
  }
}

const buildRemainingItem = (
  summary: DashboardSummary,
  budgetAmount: number,
): StatCardProps => {
  if (summary.overBudgetAmount !== null) {
    return {
      title: 'Over Budget',
      amountSpent: summary.overBudgetAmount,
      symbol: '$',
      tone: 'warning',
      additionalDescription: `Budget was ${currencyFormatter.format(budgetAmount)}`,
    }
  }
  return {
    title: 'Remaining',
    amountSpent: summary.remaining,
    symbol: '$',
    additionalDescription: PERIOD_DESCRIPTION[summary.periodState],
  }
}

const buildSummaryItems = (
  summary: DashboardSummary,
  budgetAmount: number,
): Array<StatCardProps> => [
  buildPaceItem(summary),
  buildRemainingItem(summary, budgetAmount),
  {
    title: 'Daily Average',
    amountSpent: summary.dailyAverage ?? 0,
    symbol: '$',
    additionalDescription:
      summary.dailyAverage === null ? '—' : 'per day so far',
  },
]

export function DashboardPage() {
  const { budgetId } = useParams({ from: '/_app/budget/$budgetId/' })
  const {
    summary,
    spotlight,
    categories,
    recentActivity,
    burnSeries,
    budgetAmount,
    isLoading,
  } = useDashboardData(budgetId)

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {buildSummaryItems(summary, budgetAmount).map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
        <SpotlightCategoryCard spotlight={spotlight} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-8 xl:grid-cols-2">
        <SpendingByCategory
          categories={categories}
          currentMonth={summary.periodLabel}
        />
        <BurnChart series={burnSeries} budgetAmount={budgetAmount} />
      </div>
      <div className="mt-4 md:mt-8">
        <RecentActivity recentActivity={recentActivity} />
      </div>
    </div>
  )
}
