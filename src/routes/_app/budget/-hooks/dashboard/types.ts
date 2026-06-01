import type { SpendingByCategoryItem } from '@/routes/_app/budget/-components/dashboard/spending-by-category'
import type { RecentActivityItem } from '@/routes/_app/budget/-components/dashboard/recent-activity'

export type PeriodState = 'not-started' | 'active' | 'ended'

export interface PeriodBounds {
  start: Date
  end: Date
  lengthDays: number
  label: string
  state: PeriodState
}

export interface DashboardSummary {
  paceVariance: number | null // null when period is not-started or ended
  remaining: number // ≥ 0 (clamped)
  overBudgetAmount: number | null // positive dollars when spent > budget; null otherwise
  dailyAverage: number | null // null only when period has not started
  periodLabel: string
  periodState: PeriodState
  paceState: PaceState
}
export type PaceState = 'no-data' | 'over' | 'on' | 'under'

export type SpotlightMode = 'outlier' | 'top-spender'

export interface SpotlightCategory {
  mode: SpotlightMode
  id: string
  name: string
  icon: string
  color: string
  amountSpent: number
  amountBudget: number
  overshoot: number
}

export interface BurnSeriesPoint {
  date: Date
  actual: number | null
  pace: number
  projected: number | null
}

export interface DashboardData {
  summary: DashboardSummary
  spotlight: SpotlightCategory | null
  categories: Array<SpendingByCategoryItem>
  recentActivity: Array<RecentActivityItem>
  burnSeries: Array<BurnSeriesPoint>
  budgetAmount: number
  hasAllocations: boolean
  isLoading: boolean
}
