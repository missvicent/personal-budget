import {
  differenceInCalendarDays,
  format,
  isSameMonth,
  isSameYear,
  parseISO,
  startOfDay,
} from 'date-fns'
import type { BudgetOverview } from '@/types/database.types'
import type { DashboardSummary, PeriodBounds, PeriodState } from './types'

const parseDateOnly = (value: string): Date => {
  // Values come back from Supabase as ISO date strings (YYYY-MM-DD).
  // parseISO treats them as UTC midnight which is what we want.
  return parseISO(value)
}

// date-fns endOfMonth / endOfYear operate in local time; because our date-only
// strings are parsed as UTC midnight we need UTC equivalents here so the
// boundary round-trips cleanly back to an ISO date string regardless of the
// host timezone.
const endOfMonthUTC = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0))

const endOfYearUTC = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), 11, 31))

const resolveEnd = (overview: BudgetOverview): Date => {
  if (overview.end_date) return parseDateOnly(overview.end_date)
  const start = parseDateOnly(overview.start_date)
  return overview.period === 'yearly'
    ? endOfYearUTC(start)
    : endOfMonthUTC(start)
}

const resolveState = (start: Date, end: Date, today: Date): PeriodState => {
  const todayDay = startOfDay(today)
  if (todayDay < start) return 'not-started'
  if (todayDay > end) return 'ended'
  return 'active'
}

const resolveLabel = (start: Date, end: Date): string => {
  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return format(start, 'LLLL yyyy')
  }
  return `${format(start, 'LLL d')} – ${format(end, 'LLL d, yyyy')}`
}

export const resolvePeriodBounds = (
  overview: BudgetOverview,
  today: Date,
): PeriodBounds => {
  const start = parseDateOnly(overview.start_date)
  const end = resolveEnd(overview)
  const lengthDays = differenceInCalendarDays(end, start) + 1
  return {
    start,
    end,
    lengthDays,
    label: resolveLabel(start, end),
    state: resolveState(start, end, today),
  }
}

export const computeSummary = (
  overview: BudgetOverview,
  bounds: PeriodBounds,
  today: Date,
): DashboardSummary => {
  const { start, end, lengthDays, state, label } = bounds
  const budget = overview.budget_amount
  const spent = overview.total_spent

  if (state === 'not-started') {
    return {
      budgetUsedPercent: 0,
      remaining: budget,
      projectedEnd: 0,
      safeDaily: null,
      periodLabel: label,
      periodState: state,
    }
  }

  const todayDay = startOfDay(today)
  const clampedToday = todayDay > end ? end : todayDay
  const daysElapsed = Math.max(
    1,
    differenceInCalendarDays(clampedToday, start) + 1,
  )
  const daysRemaining = Math.max(0, differenceInCalendarDays(end, clampedToday))

  const budgetUsedPercent = budget > 0 ? (spent / budget) * 100 : 0
  const remaining = budget - spent
  const projectedEnd =
    state === 'ended' ? spent : (spent / daysElapsed) * lengthDays
  const safeDaily = daysRemaining > 0 ? remaining / daysRemaining : null

  return {
    budgetUsedPercent,
    remaining,
    projectedEnd,
    safeDaily,
    periodLabel: label,
    periodState: state,
  }
}
