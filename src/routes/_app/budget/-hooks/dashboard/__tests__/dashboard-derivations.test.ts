import { describe, expect, it } from 'vitest'
import {
  buildBurnSeries,
  computeSpotlightCategory,
  computeSummary,
  mapCategories,
  mapRecentActivity,
  resolvePeriodBounds as resolveBounds,
  resolvePeriodBounds,
} from '../dashboard-derivations'
import type {
  BudgetOverview,
  BudgetWithProgress,
  TransactionWithCategory,
} from '@/types/database.types'

const baseOverview = (patch: Partial<BudgetOverview> = {}): BudgetOverview => ({
  budget_id: 'b1',
  budget_name: 'Test',
  budget_amount: 3000,
  period: 'monthly',
  start_date: '2026-04-01',
  end_date: '2026-04-30',
  is_active: true,
  total_spent: 0,
  ...patch,
})

describe('resolvePeriodBounds', () => {
  it('uses explicit end_date when present', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const bounds = resolvePeriodBounds(baseOverview(), today)

    expect(bounds.start.toISOString().slice(0, 10)).toBe('2026-04-01')
    expect(bounds.end.toISOString().slice(0, 10)).toBe('2026-04-30')
    expect(bounds.lengthDays).toBe(30)
    expect(bounds.state).toBe('active')
  })

  it('falls back to end of month when end_date is null and period is monthly', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const bounds = resolvePeriodBounds(
      baseOverview({
        end_date: null,
        start_date: '2026-04-10',
        period: 'monthly',
      }),
      today,
    )

    expect(bounds.end.toISOString().slice(0, 10)).toBe('2026-04-30')
    expect(bounds.state).toBe('active')
  })

  it('falls back to end of year when end_date is null and period is yearly', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const bounds = resolvePeriodBounds(
      baseOverview({
        end_date: null,
        start_date: '2026-03-15',
        period: 'yearly',
      }),
      today,
    )

    expect(bounds.end.toISOString().slice(0, 10)).toBe('2026-12-31')
  })

  it('returns not-started when today is before start_date', () => {
    const today = new Date('2026-03-20T12:00:00Z')
    const bounds = resolvePeriodBounds(baseOverview(), today)

    expect(bounds.state).toBe('not-started')
  })

  it('returns ended when today is after end_date', () => {
    const today = new Date('2026-05-05T12:00:00Z')
    const bounds = resolvePeriodBounds(baseOverview(), today)

    expect(bounds.state).toBe('ended')
  })

  it('formats label for a single-month window', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const bounds = resolvePeriodBounds(baseOverview(), today)

    expect(bounds.label).toBe('April 2026')
  })

  it('formats label for a custom window that spans multiple months', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const bounds = resolvePeriodBounds(
      baseOverview({ start_date: '2026-04-15', end_date: '2026-05-15' }),
      today,
    )

    expect(bounds.label).toBe('Apr 15 – May 15, 2026')
  })
})

describe('computeSummary', () => {
  const mkBounds = (overview: BudgetOverview, today: Date) =>
    resolveBounds(overview, today)

  it('computes on-pace status mid-period', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 1700 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    // day 17 of 30: expected = 3000 * 17/30 = 1700; variance = 0
    expect(s.paceVariance).toBeCloseTo(0, 5)
    expect(s.remaining).toBe(1300)
    expect(s.overBudgetAmount).toBeNull()
    expect(s.dailyAverage).toBeCloseTo(1700 / 17, 5)
    expect(s.periodState).toBe('active')
  })

  it('reports positive paceVariance when over budget mid-period', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 3500 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    // expected = 1700; variance = 3500 - 1700 = 1800
    expect(s.paceVariance).toBeCloseTo(1800, 5)
    expect(s.paceVariance).toBeGreaterThan(0)
    expect(s.remaining).toBe(0)
    expect(s.overBudgetAmount).toBe(500)
  })

  it('reports negative paceVariance when spending is below pace', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 500 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    // expected = 1700; variance = 500 - 1700 = -1200
    expect(s.paceVariance).toBeCloseTo(-1200, 5)
    expect(s.paceVariance).toBeLessThan(0)
  })

  it('returns null paceVariance with paceState="no-data" mid-period when nothing has been spent', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 0 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    expect(s.periodState).toBe('active')
    expect(s.paceVariance).toBeNull()
    expect(s.paceState).toBe('no-data')
  })

  it('returns null paceVariance and null overBudgetAmount when the period ended under budget', () => {
    const today = new Date('2026-05-05T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 2800 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    expect(s.periodState).toBe('ended')
    expect(s.paceVariance).toBeNull()
    expect(s.overBudgetAmount).toBeNull()
    // daily average freezes at period end: 2800 / 30 days
    expect(s.dailyAverage).toBeCloseTo(2800 / 30, 5)
  })

  it('returns null paceVariance and remaining=budget when the period has not started', () => {
    const today = new Date('2026-03-20T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 0 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    expect(s.periodState).toBe('not-started')
    expect(s.paceVariance).toBeNull()
    expect(s.remaining).toBe(3000)
    expect(s.overBudgetAmount).toBeNull()
    expect(s.dailyAverage).toBeNull()
  })

  it('propagates the period label from bounds', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const overview = baseOverview()
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    expect(s.periodLabel).toBe(bounds.label)
  })
})

const mkAllocation = (
  patch: Partial<BudgetWithProgress>,
): BudgetWithProgress => ({
  budget_id: 'b1',
  budget_name: 'Test',
  budget_amount: 3000,
  period: 'monthly',
  start_date: '2026-04-01',
  end_date: '2026-04-30',
  is_active: true,
  allocation_id: 'a1',
  category_id: 'c1',
  goal_id: null,
  amount: 300,
  alert_enabled: false,
  alert_threshold: 0,
  category_name: 'Food',
  category_type: 'expense',
  category_color: '#064E3B',
  category_icon: '🛒',
  goal_name: null,
  progress: 120,
  ...patch,
})

describe('mapCategories', () => {
  it('maps category-linked allocations to SpendingByCategoryItem shape', () => {
    const items = mapCategories([mkAllocation({})])

    expect(items).toEqual([
      {
        id: 'a1',
        icon: '🛒',
        category: 'Food',
        color: '#064E3B',
        amountSpent: 120,
        amountBudget: 300,
      },
    ])
  })

  it('drops goal-only allocations (no category_id)', () => {
    const items = mapCategories([
      mkAllocation({}),
      mkAllocation({
        allocation_id: 'a2',
        category_id: null,
        goal_id: 'g1',
        goal_name: 'Travel fund',
        category_name: null,
        category_color: null,
        category_icon: null,
      }),
    ])

    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('a1')
  })

  it('falls back to safe defaults when category fields are unexpectedly null', () => {
    const items = mapCategories([
      mkAllocation({
        category_name: null,
        category_icon: null,
        category_color: null,
      }),
    ])

    expect(items[0]).toMatchObject({
      category: 'Uncategorized',
      icon: '•',
      color: '#94a3b8',
    })
  })
})

const mkTxn = (
  patch: Partial<TransactionWithCategory>,
): TransactionWithCategory => ({
  id: 't1',
  amount: 42,
  budget_id: 'b1',
  category_id: 'c1',
  category_type: 'expense',
  color: '#064E3B',
  description: 'Groceries',
  icon: '🛒',
  name: 'Food',
  transaction_date: '2026-04-15',
  ...patch,
})

describe('mapRecentActivity', () => {
  it('maps transactions to RecentActivityItem shape', () => {
    const items = mapRecentActivity([mkTxn({})])

    expect(items).toEqual([
      {
        id: 't1',
        amount: 42,
        category: 'Food',
        color: '#064E3B',
        date: '2026-04-15',
        icon: '🛒',
        title: 'Groceries',
      },
    ])
  })

  it('caps output to the requested limit', () => {
    const txns = Array.from({ length: 10 }, (_, i) =>
      mkTxn({ id: `t${i}`, transaction_date: `2026-04-${20 - i}` }),
    )

    const items = mapRecentActivity(txns, 5)

    expect(items).toHaveLength(5)
    expect(items[0].id).toBe('t0')
  })

  it('defaults limit to 5 when not specified', () => {
    const txns = Array.from({ length: 10 }, (_, i) => mkTxn({ id: `t${i}` }))
    expect(mapRecentActivity(txns)).toHaveLength(5)
  })

  it('falls back to category name when description is empty', () => {
    const items = mapRecentActivity([mkTxn({ description: '' })])
    expect(items[0].title).toBe('Food')
  })
})

describe('buildBurnSeries', () => {
  const overview = baseOverview({ budget_amount: 3000 })
  const today = new Date('2026-04-03T12:00:00Z')

  it('produces one point per calendar day from start to end of period', () => {
    const bounds = resolveBounds(overview, today)
    const series = buildBurnSeries([], overview, bounds, today)

    // April has 30 days
    expect(series).toHaveLength(30)
    expect(series[0].date.toISOString().slice(0, 10)).toBe('2026-04-01')
    expect(series[29].date.toISOString().slice(0, 10)).toBe('2026-04-30')
  })

  it('renders a pace line from 0 to budget_amount across the period', () => {
    const bounds = resolveBounds(overview, today)
    const series = buildBurnSeries([], overview, bounds, today)

    expect(series[0].pace).toBeCloseTo(3000 / 30, 5)
    expect(series[29].pace).toBeCloseTo(3000, 5)
  })

  it('accumulates actual spend by transaction_date (only up to today)', () => {
    const bounds = resolveBounds(overview, today)
    const txns: Array<TransactionWithCategory> = [
      mkTxn({ id: 't1', amount: 100, transaction_date: '2026-04-01' }),
      mkTxn({ id: 't2', amount: 50, transaction_date: '2026-04-02' }),
      mkTxn({ id: 't3', amount: 25, transaction_date: '2026-04-03' }),
    ]

    const series = buildBurnSeries(txns, overview, bounds, today)

    expect(series[0].actual).toBe(100)
    expect(series[1].actual).toBe(150)
    expect(series[2].actual).toBe(175)
    // After today, actual stops being cumulative; it becomes null
    expect(series[3].actual).toBeNull()
  })

  it('projects forward from today using current slope', () => {
    const bounds = resolveBounds(overview, today)
    const txns: Array<TransactionWithCategory> = [
      mkTxn({ amount: 300, transaction_date: '2026-04-01' }),
    ]

    const series = buildBurnSeries(txns, overview, bounds, today)

    // slope = 300 / 3 days = 100/day; projected[29] = 300 + 100 * (29-2) = 3000
    expect(series[2].projected).toBe(300)
    expect(series[29].projected).toBeCloseTo(3000, 5)
  })

  it('returns only pace line (no actual, no projected) when there are no transactions', () => {
    const bounds = resolveBounds(overview, today)
    const series = buildBurnSeries([], overview, bounds, today)

    expect(series.every((p) => p.actual === 0 || p.actual === null)).toBe(true)
    expect(series.every((p) => p.projected === null)).toBe(true)
  })
})

describe('computeSpotlightCategory', () => {
  it('returns null when there are no allocations', () => {
    expect(computeSpotlightCategory([])).toBeNull()
  })

  it('returns null when every allocation is goal-only (no category_id)', () => {
    const allocations = [
      mkAllocation({
        allocation_id: 'a1',
        category_id: null,
        goal_id: 'g1',
        goal_name: 'Travel',
        category_name: null,
        category_icon: null,
        category_color: null,
      }),
    ]

    expect(computeSpotlightCategory(allocations)).toBeNull()
  })

  it('returns top spender when every category is under its budget', () => {
    const allocations = [
      mkAllocation({
        allocation_id: 'a1',
        category_name: 'Groceries',
        amount: 500,
        progress: 300,
      }),
      mkAllocation({
        allocation_id: 'a2',
        category_name: 'Dining',
        amount: 200,
        progress: 150,
      }),
    ]

    const spotlight = computeSpotlightCategory(allocations)

    expect(spotlight).not.toBeNull()
    expect(spotlight?.mode).toBe('top-spender')
    expect(spotlight?.name).toBe('Groceries')
    expect(spotlight?.amountSpent).toBe(300)
    expect(spotlight?.amountBudget).toBe(500)
  })

  it('returns outlier when a single category is over its budget', () => {
    const allocations = [
      mkAllocation({
        allocation_id: 'a1',
        category_name: 'Groceries',
        amount: 500,
        progress: 300,
      }),
      mkAllocation({
        allocation_id: 'a2',
        category_name: 'Dining',
        amount: 200,
        progress: 280,
      }),
    ]

    const spotlight = computeSpotlightCategory(allocations)

    expect(spotlight?.mode).toBe('outlier')
    expect(spotlight?.name).toBe('Dining')
    expect(spotlight?.overshoot).toBe(80)
  })

  it('picks the larger dollar overshoot when two categories are over', () => {
    const allocations = [
      mkAllocation({
        allocation_id: 'a1',
        category_name: 'Groceries',
        amount: 500,
        progress: 560, // +60
      }),
      mkAllocation({
        allocation_id: 'a2',
        category_name: 'Dining',
        amount: 200,
        progress: 320, // +120
      }),
    ]

    const spotlight = computeSpotlightCategory(allocations)

    expect(spotlight?.mode).toBe('outlier')
    expect(spotlight?.name).toBe('Dining')
    expect(spotlight?.overshoot).toBe(120)
  })

  it('prefers larger $ overshoot over larger % overshoot', () => {
    const allocations = [
      mkAllocation({
        allocation_id: 'small',
        category_name: 'Snacks',
        amount: 10,
        progress: 20, // +$10, 200%
      }),
      mkAllocation({
        allocation_id: 'big',
        category_name: 'Rent',
        amount: 1000,
        progress: 1100, // +$100, 110%
      }),
    ]

    const spotlight = computeSpotlightCategory(allocations)

    expect(spotlight?.mode).toBe('outlier')
    expect(spotlight?.name).toBe('Rent')
    expect(spotlight?.overshoot).toBe(100)
  })
})
