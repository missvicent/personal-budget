import { describe, expect, it } from 'vitest'
import {
  computeSummary,
  resolvePeriodBounds as resolveBounds,
  resolvePeriodBounds,
} from '../dashboard-derivations'
import type { BudgetOverview } from '@/types/database.types'

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
