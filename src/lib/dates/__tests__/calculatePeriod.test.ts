import { describe, expect, it } from 'vitest'
import { calculatePeriod } from '@/lib/dates/calculatePeriod'

describe('calculatePeriod', () => {
  it('adds one month for monthly period', () => {
    const start = new Date('2026-03-01T00:00:00.000Z')
    const result = calculatePeriod(start, 'monthly')
    expect(result.toISOString()).toBe('2026-04-01T00:00:00.000Z')
  })

  it('adds one year for yearly period', () => {
    const start = new Date('2026-03-01T00:00:00.000Z')
    const result = calculatePeriod(start, 'yearly')
    expect(result.toISOString()).toBe('2027-03-01T00:00:00.000Z')
  })

  it('preserves UTC midnight for dates that shift to previous day in negative UTC offset timezones', () => {
    // A date like 2026-03-15T00:00:00.000Z would be 2026-03-14 in UTC-5.
    // calculatePeriod reads UTC fields explicitly, so the result must still
    // land on UTC midnight of the expected calendar day regardless of the
    // local timezone where the code runs.
    const start = new Date('2026-03-15T00:00:00.000Z')
    const monthly = calculatePeriod(start, 'monthly')
    const yearly = calculatePeriod(start, 'yearly')

    expect(monthly.toISOString()).toBe('2026-04-15T00:00:00.000Z')
    expect(yearly.toISOString()).toBe('2027-03-15T00:00:00.000Z')

    // Verify the result is exactly UTC midnight (no time component drift)
    expect(monthly.getUTCHours()).toBe(0)
    expect(monthly.getUTCMinutes()).toBe(0)
    expect(monthly.getUTCSeconds()).toBe(0)
    expect(monthly.getUTCMilliseconds()).toBe(0)
  })
})
