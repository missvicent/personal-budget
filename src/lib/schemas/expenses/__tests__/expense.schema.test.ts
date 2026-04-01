import { describe, expect, it } from 'vitest'
import { toTransactionPayload } from '../expense.schema'

const baseData = {
  amount: 50,
  description: 'Coffee',
  transaction_date: new Date('2026-03-31'),
  is_recurring: false,
}

const FALLBACK_ID = 'other-expense-category-id'

describe('toTransactionPayload', () => {
  it('uses the provided category_id when present', () => {
    const result = toTransactionPayload(
      { ...baseData, category_id: 'user-picked-id' },
      undefined,
      FALLBACK_ID,
    )
    expect(result.category_id).toBe('user-picked-id')
  })

  it('falls back to fallbackCategoryId when category_id is undefined', () => {
    const result = toTransactionPayload(
      { ...baseData, category_id: undefined },
      undefined,
      FALLBACK_ID,
    )
    expect(result.category_id).toBe(FALLBACK_ID)
  })

  it('falls back to fallbackCategoryId when category_id is empty string', () => {
    const result = toTransactionPayload(
      { ...baseData, category_id: '' },
      undefined,
      FALLBACK_ID,
    )
    expect(result.category_id).toBe(FALLBACK_ID)
  })

  it('falls back to null when no fallbackCategoryId is provided', () => {
    const result = toTransactionPayload(
      { ...baseData, category_id: undefined },
      undefined,
    )
    expect(result.category_id).toBeNull()
  })

  it('includes budgetId when provided', () => {
    const result = toTransactionPayload(
      { ...baseData, category_id: 'cat-id' },
      'budget-123',
      FALLBACK_ID,
    )
    expect(result.budget_id).toBe('budget-123')
  })

  it('sets type to expense', () => {
    const result = toTransactionPayload(baseData)
    expect(result.type).toBe('expense')
  })

  it('formats transaction_date as YYYY-MM-DD string', () => {
    const result = toTransactionPayload(baseData)
    expect(result.transaction_date).toBe('2026-03-31')
  })
})
