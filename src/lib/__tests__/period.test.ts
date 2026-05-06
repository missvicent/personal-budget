import { format } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { getCurrentCycle } from '@/lib/period'

const ymd = (d: Date) => format(d, 'yyyy-MM-dd')

describe('getCurrentCycle', () => {
  it('monthly cycle wraps the calendar month containing today', () => {
    const cycle = getCurrentCycle('monthly', new Date(2026, 0, 15, 12))
    expect(ymd(cycle.start)).toBe('2026-01-01')
    expect(ymd(cycle.end)).toBe('2026-01-31')
    expect(cycle.daysInCycle).toBe(31)
  })

  it('yearly cycle wraps the calendar year containing today', () => {
    const cycle = getCurrentCycle('yearly', new Date(2026, 4, 5, 12))
    expect(ymd(cycle.start)).toBe('2026-01-01')
    expect(ymd(cycle.end)).toBe('2026-12-31')
    expect(cycle.daysInCycle).toBe(365)
  })

  it('handles leap year February (29 days)', () => {
    const cycle = getCurrentCycle('monthly', new Date(2024, 1, 5, 12))
    expect(cycle.daysInCycle).toBe(29)
  })

  it('clamps daysElapsed to >=1 on the cycle start day', () => {
    const cycle = getCurrentCycle('monthly', new Date(2026, 0, 1, 12))
    expect(cycle.daysElapsed).toBe(1)
    expect(cycle.daysLeft).toBe(30)
  })

  it('on the cycle end day, daysElapsed equals daysInCycle and daysLeft is 0', () => {
    const cycle = getCurrentCycle('monthly', new Date(2026, 0, 31, 12))
    expect(cycle.daysElapsed).toBe(31)
    expect(cycle.daysLeft).toBe(0)
  })

  it('does not drift across DST boundary (March)', () => {
    const cycle = getCurrentCycle('monthly', new Date(2026, 2, 15, 12))
    expect(cycle.daysInCycle).toBe(31)
    expect(cycle.daysElapsed).toBe(15)
  })
})
