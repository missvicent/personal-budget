import { describe, expect, it } from 'vitest'
import {
  debtSchema,
  debtPaymentSchema,
  toDebtPayload,
  toDebtPaymentPayload,
} from '../debt.schema'

describe('debtSchema', () => {
  it('validates a valid debt', () => {
    const result = debtSchema.safeParse({
      name: 'Chase Sapphire',
      type: 'credit_card',
      principal_amount: 12000,
      interest_rate: 19.99,
      current_balance: 8240,
      minimum_payment: 165,
      start_date: '2024-01-15',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = debtSchema.safeParse({
      name: '',
      type: 'credit_card',
      principal_amount: 12000,
      interest_rate: 19.99,
      current_balance: 8240,
      minimum_payment: 165,
      start_date: '2024-01-15',
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative interest rate', () => {
    const result = debtSchema.safeParse({
      name: 'Test',
      type: 'mortgage',
      principal_amount: 200000,
      interest_rate: -1,
      current_balance: 180000,
      minimum_payment: 1200,
      start_date: '2023-06-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects interest rate over 100', () => {
    const result = debtSchema.safeParse({
      name: 'Test',
      type: 'personal_loan',
      principal_amount: 5000,
      interest_rate: 101,
      current_balance: 4500,
      minimum_payment: 150,
      start_date: '2024-03-01',
    })
    expect(result.success).toBe(false)
  })
})

describe('debtPaymentSchema', () => {
  it('validates a valid payment', () => {
    const result = debtPaymentSchema.safeParse({
      amount_paid: 500,
      payment_date: '2026-03-01',
      notes: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects zero payment', () => {
    const result = debtPaymentSchema.safeParse({
      amount_paid: 0,
      payment_date: '2026-03-01',
    })
    expect(result.success).toBe(false)
  })
})

describe('toDebtPayload', () => {
  it('transforms form data to DB payload with defaults', () => {
    const payload = toDebtPayload({
      name: 'My Loan',
      type: 'personal_loan',
      principal_amount: 10000,
      interest_rate: 8.5,
      current_balance: 9000,
      minimum_payment: 250,
      start_date: '2024-06-01',
    })
    expect(payload).toEqual({
      name: 'My Loan',
      type: 'personal_loan',
      principal_amount: 10000,
      interest_rate: 8.5,
      current_balance: 9000,
      minimum_payment: 250,
      start_date: '2024-06-01',
      is_active: true,
    })
  })
})
