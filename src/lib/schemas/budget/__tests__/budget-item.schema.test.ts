import { describe, expect, it } from 'vitest'
import { createBudgetItemSchema } from '../budget-item.schema'

const validItem = {
  category_id: 'cat-1',
  category_name: 'Groceries',
  amount: 100,
  alert_enabled: false,
}

describe('createBudgetItemSchema', () => {
  it('accepts amount equal to remaining budget', () => {
    const schema = createBudgetItemSchema(100)
    const result = schema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('accepts amount below remaining budget', () => {
    const schema = createBudgetItemSchema(200)
    const result = schema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('rejects amount exceeding remaining budget', () => {
    const schema = createBudgetItemSchema(50)
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
    const schema = createBudgetItemSchema(500)
    const result = schema.safeParse({ ...validItem, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('still rejects missing category_id', () => {
    const schema = createBudgetItemSchema(500)
    const result = schema.safeParse({ ...validItem, category_id: '' })
    expect(result.success).toBe(false)
  })
})
