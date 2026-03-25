import { describe, expect, it } from 'vitest'
import { BudgetItemSchema } from '../budget-item.schema'

describe('BudgetItemSchema', () => {
  it('validates a valid budget', () => {
    const result = BudgetItemSchema.safeParse({
      name: 'Monthly groceries',
      amount: 500,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = BudgetItemSchema.safeParse({
      name: '',
      amount: 500,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects zero amount', () => {
    const result = BudgetItemSchema.safeParse({
      name: 'Test',
      amount: 0,
      period: 'monthly',
      start_date: '2026-03-01',
    })
    expect(result.success).toBe(false)
  })

  it('defaults period to undefined when omitted', () => {
    const result = BudgetItemSchema.safeParse({
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
