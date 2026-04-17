import { describe, expect, it } from 'vitest'
import {
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

    expect(s.budgetUsedPercent).toBeCloseTo((1700 / 3000) * 100, 5)
    expect(s.remaining).toBe(1300)
    // day 17 of 30: projected = 1700 / 17 * 30
    expect(s.projectedEnd).toBeCloseTo((1700 / 17) * 30, 5)
    // safeDaily = 1300 / 13 remaining days
    expect(s.safeDaily).toBeCloseTo(1300 / 13, 5)
    expect(s.periodState).toBe('active')
  })

  it('returns negative remaining when over budget', () => {
    const today = new Date('2026-04-17T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 3500 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    expect(s.remaining).toBe(-500)
    expect(s.projectedEnd).toBeGreaterThan(3000)
  })

  it('collapses projectedEnd to total_spent and sets safeDaily null when period ended', () => {
    const today = new Date('2026-05-05T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 2800 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    expect(s.periodState).toBe('ended')
    expect(s.projectedEnd).toBe(2800)
    expect(s.safeDaily).toBeNull()
  })

  it('returns all-zero summary when period has not started', () => {
    const today = new Date('2026-03-20T12:00:00Z')
    const overview = baseOverview({ budget_amount: 3000, total_spent: 0 })
    const bounds = mkBounds(overview, today)

    const s = computeSummary(overview, bounds, today)

    expect(s.periodState).toBe('not-started')
    expect(s.budgetUsedPercent).toBe(0)
    expect(s.remaining).toBe(3000)
    expect(s.projectedEnd).toBe(0)
    expect(s.safeDaily).toBeNull()
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
