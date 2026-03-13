import { describe, expect, it } from 'vitest'
import {
  calculateSnowball,
  calculateAvalanche,
  type DebtInput,
} from '../payoff-strategies'

const twoDebts: Array<DebtInput> = [
  {
    debtId: 'card',
    name: 'Credit Card',
    balance: 5000,
    interestRate: 20,
    minimumPayment: 100,
  },
  {
    debtId: 'car',
    name: 'Car Loan',
    balance: 15000,
    interestRate: 5,
    minimumPayment: 300,
  },
]

describe('calculateSnowball', () => {
  it('returns a valid result with correct strategy label', () => {
    const result = calculateSnowball(twoDebts, 0)
    expect(result.strategy).toBe('snowball')
    expect(result.totalMonths).toBeGreaterThan(0)
    expect(result.totalInterestPaid).toBeGreaterThan(0)
    expect(result.totalPaid).toBeGreaterThan(result.totalInterestPaid)
    expect(result.debtPayoffOrder).toHaveLength(2)
  })

  it('pays smallest balance first (credit card before car) with extra payment', () => {
    const result = calculateSnowball(twoDebts, 200)
    const cardOrder = result.debtPayoffOrder.find((d) => d.debtId === 'card')
    const carOrder = result.debtPayoffOrder.find((d) => d.debtId === 'car')
    expect(cardOrder!.payoffMonth).toBeLessThan(carOrder!.payoffMonth)
  })

  it('extra payment reduces total months and interest', () => {
    const withoutExtra = calculateSnowball(twoDebts, 0)
    const withExtra = calculateSnowball(twoDebts, 200)
    expect(withExtra.totalMonths).toBeLessThan(withoutExtra.totalMonths)
    expect(withExtra.totalInterestPaid).toBeLessThan(withoutExtra.totalInterestPaid)
  })

  it('handles single debt', () => {
    const single: Array<DebtInput> = [
      { debtId: 'only', name: 'Only Debt', balance: 1000, interestRate: 10, minimumPayment: 100 },
    ]
    const result = calculateSnowball(single, 0)
    expect(result.debtPayoffOrder).toHaveLength(1)
    expect(result.totalMonths).toBeGreaterThan(0)
  })

  it('handles 0% interest rate', () => {
    const zeroRate: Array<DebtInput> = [
      { debtId: 'free', name: 'Interest Free', balance: 1200, interestRate: 0, minimumPayment: 100 },
    ]
    const result = calculateSnowball(zeroRate, 0)
    expect(result.totalMonths).toBe(12)
    expect(result.totalInterestPaid).toBe(0)
    expect(result.totalPaid).toBe(1200)
  })

  it('caps at 360 months', () => {
    const tiny: Array<DebtInput> = [
      { debtId: 'huge', name: 'Huge Debt', balance: 1_000_000, interestRate: 25, minimumPayment: 1 },
    ]
    const result = calculateSnowball(tiny, 0)
    expect(result.totalMonths).toBe(360)
  })

  it('handles minimum payment exceeding balance', () => {
    const small: Array<DebtInput> = [
      { debtId: 'tiny', name: 'Tiny Debt', balance: 50, interestRate: 15, minimumPayment: 100 },
    ]
    const result = calculateSnowball(small, 0)
    expect(result.totalMonths).toBe(1)
    expect(result.totalPaid).toBeLessThanOrEqual(50 + 10)
  })

  it('returns empty result for no debts', () => {
    const result = calculateSnowball([], 0)
    expect(result.totalMonths).toBe(0)
    expect(result.totalInterestPaid).toBe(0)
    expect(result.debtPayoffOrder).toHaveLength(0)
  })
})

describe('calculateAvalanche', () => {
  it('returns a valid result with correct strategy label', () => {
    const result = calculateAvalanche(twoDebts, 0)
    expect(result.strategy).toBe('avalanche')
    expect(result.totalMonths).toBeGreaterThan(0)
  })

  it('pays highest rate first (credit card before car) with extra payment', () => {
    const result = calculateAvalanche(twoDebts, 200)
    const cardOrder = result.debtPayoffOrder.find((d) => d.debtId === 'card')
    const carOrder = result.debtPayoffOrder.find((d) => d.debtId === 'car')
    expect(cardOrder!.payoffMonth).toBeLessThan(carOrder!.payoffMonth)
  })

  it('avalanche pays less total interest than snowball for high-rate debts', () => {
    const debts: Array<DebtInput> = [
      { debtId: 'low-balance-high-rate', name: 'High Rate Card', balance: 8000, interestRate: 24, minimumPayment: 160 },
      { debtId: 'high-balance-low-rate', name: 'Low Rate Loan', balance: 3000, interestRate: 4, minimumPayment: 100 },
    ]
    const snowball = calculateSnowball(debts, 100)
    const avalanche = calculateAvalanche(debts, 100)
    expect(avalanche.totalInterestPaid).toBeLessThanOrEqual(snowball.totalInterestPaid)
  })
})
