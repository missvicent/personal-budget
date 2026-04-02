import { describe, expect, it } from 'vitest'
import { getOverspendingTransactionIds } from '../budget.utils'

describe('getOverspendingTransactionIds', () => {
  it('returns empty sets when no transactions', () => {
    const result = getOverspendingTransactionIds([], 1000)
    expect(result.transactionIds.size).toBe(0)
    expect(result.categoryIds.size).toBe(0)
  })

  it('returns empty sets when total spending is under budget', () => {
    const transactions = [
      {
        id: 'tx1',
        category_id: 'cat1',
        amount: 300,
        transaction_date: '2026-03-01',
      },
      {
        id: 'tx2',
        category_id: 'cat2',
        amount: 400,
        transaction_date: '2026-03-02',
      },
    ]
    const result = getOverspendingTransactionIds(transactions, 1000)
    expect(result.transactionIds.size).toBe(0)
    expect(result.categoryIds.size).toBe(0)
  })

  it('flags transactions that push total over budget chronologically', () => {
    const transactions = [
      {
        id: 'tx1',
        category_id: 'cat1',
        amount: 3000,
        transaction_date: '2026-03-01',
      },
      {
        id: 'tx2',
        category_id: 'cat2',
        amount: 2000,
        transaction_date: '2026-03-02',
      },
    ]
    const result = getOverspendingTransactionIds(transactions, 4500)
    expect(result.transactionIds).toEqual(new Set(['tx2']))
    expect(result.categoryIds).toEqual(new Set(['cat2']))
  })

  it('flags multiple transactions after the threshold', () => {
    const transactions = [
      {
        id: 'tx1',
        category_id: 'cat1',
        amount: 4500,
        transaction_date: '2026-03-01',
      },
      {
        id: 'tx2',
        category_id: 'cat2',
        amount: 5699,
        transaction_date: '2026-04-02',
      },
      {
        id: 'tx3',
        category_id: 'cat1',
        amount: 100,
        transaction_date: '2026-04-03',
      },
    ]
    const result = getOverspendingTransactionIds(transactions, 4500)
    expect(result.transactionIds).toEqual(new Set(['tx2', 'tx3']))
    expect(result.categoryIds).toEqual(new Set(['cat2', 'cat1']))
  })

  it('sorts by transaction_date regardless of input order', () => {
    const transactions = [
      {
        id: 'tx2',
        category_id: 'cat2',
        amount: 5699,
        transaction_date: '2026-04-02',
      },
      {
        id: 'tx1',
        category_id: 'cat1',
        amount: 4500,
        transaction_date: '2026-03-01',
      },
    ]
    const result = getOverspendingTransactionIds(transactions, 4500)
    expect(result.transactionIds).toEqual(new Set(['tx2']))
    expect(result.categoryIds).toEqual(new Set(['cat2']))
  })

  it('flags all when budget is zero', () => {
    const transactions = [
      {
        id: 'tx1',
        category_id: 'cat1',
        amount: 100,
        transaction_date: '2026-03-01',
      },
    ]
    const result = getOverspendingTransactionIds(transactions, 0)
    expect(result.transactionIds).toEqual(new Set(['tx1']))
    expect(result.categoryIds).toEqual(new Set(['cat1']))
  })
})
