import { describe, expect, it } from 'vitest'
import {
  budgetSchema,
  toBudgetRequestBody,
  toUpdateRequestBody,
} from '../budget.schema'

describe('budgetSchema', () => {
  it('validates a valid budget', () => {
    const result = budgetSchema.safeParse({
      name: 'Monthly groceries',
      amount: 500,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = budgetSchema.safeParse({
      name: '',
      amount: 500,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects zero amount', () => {
    const result = budgetSchema.safeParse({
      name: 'Test',
      amount: 0,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(false)
  })

  it('defaults period to undefined when omitted', () => {
    const result = budgetSchema.safeParse({
      name: 'Test',
      amount: 100,
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.period).toBeUndefined()
    }
  })
})

describe('toBudgetRequestBody', () => {
  it('calculates end_date for new budgets', () => {
    const result = toBudgetRequestBody({
      name: 'Test',
      amount: 500,
      period: 'monthly',
      start_date: '2026-03-01T00:00:00.000Z',
    })
    expect(result.end_date).toBe('2026-04-01T00:00:00.000Z')
  })

  it('calculates yearly end_date correctly', () => {
    const result = toBudgetRequestBody({
      name: 'Test',
      amount: 500,
      period: 'yearly',
      start_date: '2026-03-01T00:00:00.000Z',
    })
    expect(result.end_date).toBe('2027-03-01T00:00:00.000Z')
  })
})

describe('toUpdateRequestBody', () => {
  it('omits end_date when start_date is not dirty', () => {
    const result = toUpdateRequestBody(
      {
        id: '123',
        name: 'Updated name',
        amount: 500,
        period: 'monthly',
        start_date: '2026-03-01T00:00:00.000Z',
      },
      { name: true },
    )
    expect(result.end_date).toBeUndefined()
  })

  it('recalculates end_date when start_date is dirty', () => {
    const result = toUpdateRequestBody(
      {
        id: '123',
        name: 'Test',
        amount: 500,
        period: 'monthly',
        start_date: '2026-05-01T00:00:00.000Z',
      },
      { start_date: true },
    )
    expect(result.end_date).toBe('2026-06-01T00:00:00.000Z')
  })

  it('recalculates end_date when period is dirty', () => {
    const result = toUpdateRequestBody(
      {
        id: '123',
        name: 'Test',
        amount: 500,
        period: 'yearly',
        start_date: '2026-03-01T00:00:00.000Z',
      },
      { period: true },
    )
    expect(result.end_date).toBe('2027-03-01T00:00:00.000Z')
  })
})
