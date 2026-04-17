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
  remaining: number
  projectedEnd: number
  safeDaily: number | null
  periodLabel: string
  periodState: PeriodState
}

export interface BurnSeriesPoint {
  date: Date
  actual: number | null
  pace: number
  projected: number | null
}

export interface DashboardData {
  summary: DashboardSummary
  categories: Array<SpendingByCategoryItem>
  recentActivity: Array<RecentActivityItem>
  burnSeries: Array<BurnSeriesPoint>
  budgetAmount: number
  isLoading: boolean
}
