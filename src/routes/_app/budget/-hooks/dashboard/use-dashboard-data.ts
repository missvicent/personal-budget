import { useMemo } from 'react'
import {
  buildBurnSeries,
  computeSpotlightCategory,
  computeSummary,
  mapCategories,
  mapRecentActivity,
  resolvePeriodBounds,
} from './dashboard-derivations'
import type { DashboardData } from './types'
import { useAllocations } from '@/hooks/allocation/use-allocation'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { useGetTransactionsWithCategories } from '@/hooks/transactions/use-transaction-with-categories'

export const useDashboardData = (
  budgetId: string,
  now: Date = new Date(),
): DashboardData => {
  const budgetOverviewQuery = useBudgetOverview()
  const allocationsQuery = useAllocations(budgetId)
  const transactionsQuery = useGetTransactionsWithCategories(budgetId)

  const overview = useMemo(
    () => budgetOverviewQuery.data?.find((b) => b.budget_id === budgetId),
    [budgetOverviewQuery.data, budgetId],
  )

  return useMemo<DashboardData>(() => {
    const isLoading =
      budgetOverviewQuery.isLoading ||
      allocationsQuery.isLoading ||
      transactionsQuery.isLoading

    if (!overview) {
      return {
        summary: {
          budgetUsedPercent: 0,
          remaining: 0,
          overBudgetAmount: null,
          dailyAverage: null,
          periodLabel: '',
          periodState: 'not-started',
        },
        spotlight: null,
        categories: [],
        recentActivity: [],
        burnSeries: [],
        budgetAmount: 0,
        isLoading,
      }
    }

    const bounds = resolvePeriodBounds(overview, now)
    return {
      summary: computeSummary(overview, bounds, now),
      spotlight: computeSpotlightCategory(allocationsQuery.data ?? []),
      categories: mapCategories(allocationsQuery.data ?? []),
      recentActivity: mapRecentActivity(transactionsQuery.data ?? []),
      burnSeries: buildBurnSeries(
        transactionsQuery.data ?? [],
        overview,
        bounds,
        now,
      ),
      budgetAmount: overview.budget_amount,
      isLoading,
    }
  }, [
    overview,
    allocationsQuery.data,
    allocationsQuery.isLoading,
    transactionsQuery.data,
    transactionsQuery.isLoading,
    budgetOverviewQuery.isLoading,
    now,
  ])
}
