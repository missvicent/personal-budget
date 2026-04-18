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
  budgetUsedPercent: number
  remaining: number // always ≥ 0 (clamped in derivation)
  overBudgetAmount: number | null // positive dollars when spent > budget; null otherwise
  dailyAverage: number | null // null only when period has not started
  periodLabel: string
  periodState: PeriodState
}

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
  isLoading: boolean
}
