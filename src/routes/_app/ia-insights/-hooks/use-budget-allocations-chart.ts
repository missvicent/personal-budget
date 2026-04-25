import type { BudgetWithProgress } from '@/types/budget.types'
import { useAllocations } from '@/hooks/allocation/use-allocation'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import {
  toAllocationChartConfig,
  toAllocationChartData,
} from '@/lib/mappers/allocations'

const UNCATEGORIZED_COLOR = 'var(--muted-foreground)'
const UNCATEGORIZED_NAME = 'Uncategorized'

const buildUncategorizedAllocation = (
  budgetId: string,
  amount: number,
): BudgetWithProgress => ({
  budget_id: budgetId,
  budget_name: '',
  budget_amount: 0,
  period: 'monthly',
  start_date: '',
  end_date: null,
  is_active: true,
  allocation_id: `uncategorized-${budgetId}`,
  category_id: null,
  goal_id: null,
  amount: 0,
  alert_enabled: false,
  alert_threshold: 0,
  category_name: UNCATEGORIZED_NAME,
  category_type: null,
  category_color: UNCATEGORIZED_COLOR,
  category_icon: null,
  goal_name: null,
  progress: amount,
})

export const useBudgetAllocations = (budgetId: string) => {
  const { data: allocations, isFetching: isAllocationsFetching } =
    useAllocations(budgetId)
  const { data: budgetOverviews, isFetching: isOverviewFetching } =
    useBudgetOverview()

  const overview = budgetOverviews?.find((b) => b.budget_id === budgetId)
  const totalSpent = overview?.total_spent ?? 0
  const allocatedSpent = (allocations ?? []).reduce(
    (sum, a) => sum + a.progress,
    0,
  )
  const uncategorizedSpent = Math.max(0, totalSpent - allocatedSpent)

  const enrichedAllocations: Array<BudgetWithProgress> = [
    ...(allocations ?? []),
    ...(uncategorizedSpent > 0
      ? [buildUncategorizedAllocation(budgetId, uncategorizedSpent)]
      : []),
  ]

  const chartData = toAllocationChartData(enrichedAllocations)
  const chartConfig = toAllocationChartConfig(enrichedAllocations)

  return {
    allocations: enrichedAllocations,
    chartData,
    chartConfig,
    isLoading: isAllocationsFetching || isOverviewFetching,
  }
}
