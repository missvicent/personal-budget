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

const DESCRIPTION_BY_STATE: Record<DashboardSummary['periodState'], string> = {
  'not-started': 'Period has not started',
  active: 'This period',
  ended: 'Period ended',
}

const buildSummaryItems = (
  summary: DashboardSummary,
  budgetAmount: number,
): Array<StatCardProps> => {
  const description = DESCRIPTION_BY_STATE[summary.periodState]

  const paceItem: StatCardProps = (() => {
    if (summary.paceVariance === null) {
      return {
        title: 'Pace Variance',
        amountSpent: 0,
        symbol: '$',
        additionalDescription:
          summary.periodState === 'not-started'
            ? 'Period has not started'
            : 'Period ended',
      }
    }
    if (summary.paceVariance > 0) {
      return {
        title: 'Pace Variance',
        amountSpent: summary.paceVariance,
        symbol: '$',
        tone: 'warning',
        additionalDescription: 'over pace',
      }
    }
    return {
      title: 'Pace Variance',
      amountSpent: summary.paceVariance, // negative or 0
      symbol: '$',
      additionalDescription:
        summary.paceVariance === 0 ? 'on pace' : 'under pace',
    }
  })()

  const remainingItem: StatCardProps =
    summary.overBudgetAmount === null
      ? {
          title: 'Remaining',
          amountSpent: summary.remaining,
          symbol: '$',
          additionalDescription: description,
        }
      : {
          title: 'Over Budget',
          amountSpent: summary.overBudgetAmount,
          symbol: '$',
          tone: 'warning',
          additionalDescription: `Budget was ${currencyFormatter.format(budgetAmount)}`,
        }

  return [
    paceItem,
    remainingItem,
    {
      title: 'Daily Average',
      amountSpent: summary.dailyAverage ?? 0,
      symbol: '$',
      additionalDescription:
        summary.dailyAverage === null ? '—' : 'per day so far',
    },
  ]
}

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
