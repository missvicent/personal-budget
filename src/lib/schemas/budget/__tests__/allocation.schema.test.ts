import { describe, expect, it } from 'vitest'
import {
  createAllocationSchema,
  updateAllocationSchema,
} from '../allocation.schema'

const validItem = {
  budget_id: 'budget-1',
  category_id: 'cat-1',
  amount: 100,
  alert_enabled: false,
  mode: 'expense' as const,
}

describe('createAllocationSchema', () => {
  it('accepts amount equal to remaining budget', () => {
    const schema = createAllocationSchema(100)
    const result = schema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('accepts amount below remaining budget', () => {
    const schema = createAllocationSchema(200)
    const result = schema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('rejects amount exceeding remaining budget', () => {
    const schema = createAllocationSchema(50)
    const result = schema.safeParse(validItem)
    expect(result.success).toBe(false)
    if (!result.success) {
      const amountError = result.error.issues.find(
        (i) => i.path[0] === 'amount',
      )
      expect(amountError).toBeDefined()
      expect(amountError?.message).toContain('remaining budget')
    }
  })

  it('still rejects zero amount', () => {
    const schema = createAllocationSchema(500)
    const result = schema.safeParse({ ...validItem, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('still rejects missing category_id', () => {
    const schema = createAllocationSchema(500)
    const result = schema.safeParse({ ...validItem, category_id: '' })
    expect(result.success).toBe(false)
  })
})

describe('updateAllocationSchema', () => {
  it('accepts amount up to remainingBudget + currentAmount', () => {
    const schema = updateAllocationSchema(50, 100)
    const result = schema.safeParse({ ...validItem, amount: 150 })
    expect(result.success).toBe(true)
  })

  it('rejects amount exceeding remainingBudget + currentAmount', () => {
    const schema = updateAllocationSchema(50, 100)
    const result = schema.safeParse({ ...validItem, amount: 151 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const amountError = result.error.issues.find(
        (i) => i.path[0] === 'amount',
      )
      expect(amountError).toBeDefined()
      expect(amountError?.message).toContain('remaining budget')
    }
  })

  it('still rejects zero amount', () => {
    const schema = updateAllocationSchema(50, 100)
    const result = schema.safeParse({ ...validItem, amount: 0 })
    expect(result.success).toBe(false)
  })
})
