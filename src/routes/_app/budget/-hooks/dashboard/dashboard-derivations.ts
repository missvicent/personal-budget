import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  isSameYear,
  parseISO,
  startOfDay,
} from 'date-fns'
import type {
  BudgetOverview,
  BudgetWithProgress,
  TransactionWithCategory,
} from '@/types/database.types'
import type { SpendingByCategoryItem } from '@/routes/_app/budget/-components/dashboard/spending-by-category'
import type { RecentActivityItem } from '@/routes/_app/budget/-components/dashboard/recent-activity'
import type {
  BurnSeriesPoint,
  DashboardSummary,
  PeriodBounds,
  PeriodState,
  SpotlightCategory,
} from './types'

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
      paceVariance: null,
      remaining: budget,
      overBudgetAmount: null,
      dailyAverage: null,
      periodLabel: label,
      periodState: state,
      paceState: 'no-data',
    }
  }

  const todayDay = startOfDay(today)
  const clampedToday = todayDay > end ? end : todayDay
  const daysElapsed = Math.max(
    1,
    differenceInCalendarDays(clampedToday, start) + 1,
  )

  const remaining = Math.max(0, budget - spent)
  const overBudgetAmount = spent > budget ? spent - budget : null
  const dailyAverage = spent / daysElapsed
  const expectedSpent = budget * (daysElapsed / lengthDays)
  const paceVariance =
    state === 'ended' || spent === 0 ? null : spent - expectedSpent

  return {
    paceVariance,
    remaining,
    overBudgetAmount,
    dailyAverage,
    periodLabel: label,
    periodState: state,
    paceState:
      paceVariance === null
        ? 'no-data'
        : paceVariance > 0
          ? 'over'
          : paceVariance < 0
            ? 'under'
            : 'on',
  }
}

const CATEGORY_DEFAULT_ICON = '•'
const CATEGORY_DEFAULT_COLOR = '#94a3b8'
const CATEGORY_DEFAULT_NAME = 'Uncategorized'

export const mapCategories = (
  allocations: Array<BudgetWithProgress>,
): Array<SpendingByCategoryItem> =>
  allocations
    .filter((a) => a.category_id !== null)
    .map((a) => ({
      id: a.allocation_id,
      icon: a.category_icon ?? CATEGORY_DEFAULT_ICON,
      category: a.category_name ?? CATEGORY_DEFAULT_NAME,
      color: a.category_color ?? CATEGORY_DEFAULT_COLOR,
      amountSpent: a.progress,
      amountBudget: a.amount,
    }))

export const mapRecentActivity = (
  transactions: Array<TransactionWithCategory>,
  limit = 5,
): Array<RecentActivityItem> =>
  transactions.slice(0, limit).map((t) => ({
    id: t.id,
    amount: t.amount,
    category: t.name,
    color: t.color,
    date: t.transaction_date,
    icon: t.icon,
    title: t.description.trim() ? t.description : t.name,
  }))

const toDateKey = (d: Date): string => format(d, 'yyyy-MM-dd')

export const buildBurnSeries = (
  transactions: Array<TransactionWithCategory>,
  overview: BudgetOverview,
  bounds: PeriodBounds,
  today: Date,
): Array<BurnSeriesPoint> => {
  const totals = new Map<string, number>()
  for (const t of transactions) {
    const key = t.transaction_date.slice(0, 10)
    totals.set(key, (totals.get(key) ?? 0) + t.amount)
  }

  const days = eachDayOfInterval({ start: bounds.start, end: bounds.end })
  const paceStep = overview.budget_amount / bounds.lengthDays
  const todayDay = startOfDay(today)

  let cumulative = 0
  // First pass: build actual + pace, track the last-known cumulative up to today.
  const withActual = days.map((day, idx) => {
    const afterToday = isAfter(day, todayDay)
    if (!afterToday) {
      cumulative += totals.get(toDateKey(day)) ?? 0
    }
    return {
      date: day,
      actual: afterToday ? null : cumulative,
      pace: paceStep * (idx + 1),
      projected: null as number | null,
    }
  })

  // Days elapsed so far (for slope). Clamped to >=1 to avoid divide-by-zero
  // on the very first day of the period.
  const elapsed = Math.max(
    1,
    differenceInCalendarDays(todayDay, bounds.start) + 1,
  )
  const spentToDate = cumulative
  const slope = spentToDate / elapsed

  // Only emit projected line when we actually have spending to project.
  if (spentToDate <= 0) return withActual

  return withActual.map((p) => {
    if (isBefore(p.date, todayDay)) return p
    const daysFromToday = differenceInCalendarDays(p.date, todayDay)
    return { ...p, projected: spentToDate + slope * daysFromToday }
  })
}

export const computeSpotlightCategory = (
  allocations: Array<BudgetWithProgress>,
): SpotlightCategory | null => {
  const withCategory = allocations.filter((a) => a.category_id !== null)
  if (withCategory.length === 0) return null

  const enriched = withCategory.map((a) => ({
    row: a,
    overshoot: a.progress - a.amount,
  }))

  const overshooters = enriched.filter((e) => e.overshoot > 0)
  const pick =
    overshooters.length > 0
      ? overshooters.reduce((best, curr) =>
          curr.overshoot > best.overshoot ? curr : best,
        )
      : enriched.reduce((best, curr) =>
          curr.row.progress > best.row.progress ? curr : best,
        )

  const row = pick.row
  return {
    mode: overshooters.length > 0 ? 'outlier' : 'top-spender',
    id: row.allocation_id,
    name: row.category_name ?? CATEGORY_DEFAULT_NAME,
    icon: row.category_icon ?? CATEGORY_DEFAULT_ICON,
    color: row.category_color ?? CATEGORY_DEFAULT_COLOR,
    amountSpent: row.progress,
    amountBudget: row.amount,
    overshoot: pick.overshoot,
  }
}
