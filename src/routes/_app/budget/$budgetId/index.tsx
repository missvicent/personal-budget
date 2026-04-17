import { createFileRoute, useParams } from '@tanstack/react-router'
import { RecentActivity } from '../-components/dashboard/recent-activity'
import { SpendingByCategory } from '../-components/dashboard/spending-by-category'
import { SummaryGrid } from '../-components/dashboard/summary-grid'
import { BurnChart } from '../-components/dashboard/burn-chart'
import { DashboardSkeleton } from '../-components/dashboard/dashboard-skeleton'
import { useDashboardData } from '../-hooks/dashboard/use-dashboard-data'
import type { SummaryGridItem } from '../-components/dashboard/summary-grid'
import type { DashboardSummary } from '../-hooks/dashboard/types'

export const Route = createFileRoute('/_app/budget/$budgetId/')({
  component: DashboardPage,
})

const DESCRIPTION_BY_STATE: Record<DashboardSummary['periodState'], string> = {
  'not-started': 'Period has not started',
  active: 'This period',
  ended: 'Period ended',
}

const buildSummaryItems = (
  summary: DashboardSummary,
): Array<SummaryGridItem> => {
  const description = DESCRIPTION_BY_STATE[summary.periodState]
  return [
    {
      title: 'Budget Used',
      percentage: summary.budgetUsedPercent / 100,
      symbol: '%',
      additionalDescription: description,
    },
    {
      title: 'Remaining',
      amountSpent: summary.remaining,
      symbol: '$',
      additionalDescription: description,
    },
    {
      title: 'Projected End',
      amountSpent: summary.projectedEnd,
      symbol: '$',
      additionalDescription: description,
    },
    {
      title: 'Safe Daily',
      amountSpent: summary.safeDaily ?? 0,
      symbol: '$',
      additionalDescription:
        summary.safeDaily === null ? '—' : 'per remaining day',
    },
  ]
}

export function DashboardPage() {
  const { budgetId } = useParams({ from: '/_app/budget/$budgetId/' })
  const {
    summary,
    categories,
    recentActivity,
    burnSeries,
    budgetAmount,
    isLoading,
  } = useDashboardData(budgetId)

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="min-h-screen p-8">
      <SummaryGrid summaryData={buildSummaryItems(summary)} />
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2">
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
