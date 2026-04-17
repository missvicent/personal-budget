import {
  differenceInCalendarDays,
  format,
  isSameMonth,
  isSameYear,
  parseISO,
  startOfDay,
} from 'date-fns'
import type { BudgetOverview } from '@/types/database.types'
import type { PeriodBounds, PeriodState } from './types'

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
