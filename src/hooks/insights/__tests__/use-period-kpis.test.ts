import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { BudgetOverview } from '@/types/budget.types'
import type { TransactionWithCategory } from '@/types/transaction.types'

vi.mock('@/hooks/budget/use-budget-overview', () => ({
  useBudgetOverview: vi.fn(),
}))
vi.mock('@/hooks/transactions/use-transaction-with-categories', () => ({
  useGetTransactionsWithCategories: vi.fn(),
}))

const { useBudgetOverview } = await import('@/hooks/budget/use-budget-overview')
const { useGetTransactionsWithCategories } =
  await import('@/hooks/transactions/use-transaction-with-categories')
const { usePeriodKpis } = await import('../use-period-kpis')

function mockQuery<T>(data: unknown, isLoading = false): T {
  return { data, isLoading, isError: false, error: null } as unknown as T
}

const overview: BudgetOverview = {
  budget_id: 'b1',
  budget_name: 'Test',
  budget_amount: 3000,
  period: 'monthly',
  start_date: '2026-04-01',
  end_date: null,
  is_active: true,
  total_spent: 0,
}

const tx = (
  id: string,
  date: string,
  amount: number,
  category_type = 'expense',
): TransactionWithCategory =>
  ({
    id,
    transaction_date: date,
    amount,
    category_type,
  }) as unknown as TransactionWithCategory

const setMocks = (
  budgets: Array<BudgetOverview>,
  transactions: Array<TransactionWithCategory>,
  isLoading = false,
) => {
  vi.mocked(useBudgetOverview).mockReturnValue(
    mockQuery<ReturnType<typeof useBudgetOverview>>(budgets, isLoading),
  )
  vi.mocked(useGetTransactionsWithCategories).mockReturnValue(
    mockQuery<ReturnType<typeof useGetTransactionsWithCategories>>(
      transactions,
      isLoading,
    ),
  )
}

// May 15 noon local — 31-day month, daysElapsed=15, daysLeft=16
const today = new Date(2026, 4, 15, 12)

describe('usePeriodKpis', () => {
  it('returns zeroed metrics with empty transactions', () => {
    setMocks([overview], [])
    const { result } = renderHook(() => usePeriodKpis('b1', today))
    expect(result.current.spent.actual).toBe(0)
    expect(result.current.avgDay.actual).toBe(0)
    expect(result.current.pacing.utilizationPct).toBe(0)
    expect(result.current.pacing.isOver).toBe(false)
    expect(result.current.cycle.daysLeft).toBe(16)
  })

  it('reports over-budget when spend exceeds budget', () => {
    setMocks([overview], [tx('1', '2026-05-10', 5000)])
    const { result } = renderHook(() => usePeriodKpis('b1', today))
    expect(result.current.spent.actual).toBe(5000)
    expect(result.current.pacing.isOver).toBe(true)
    expect(Math.round(result.current.pacing.utilizationPct)).toBe(167)
    expect(result.current.spent.deltaPct).toBeCloseTo(66.67, 1)
  })

  it('zero-fills daily series to length === daysInCycle', () => {
    setMocks(
      [overview],
      [tx('1', '2026-05-10', 200), tx('2', '2026-05-11', 300)],
    )
    const { result } = renderHook(() => usePeriodKpis('b1', today))
    expect(result.current.spent.daily.length).toBe(31)
    expect(result.current.spent.daily.filter((d) => d.amount > 0).length).toBe(
      2,
    )
  })

  it('excludes income transactions from spent', () => {
    setMocks(
      [overview],
      [
        tx('1', '2026-05-10', 1000, 'expense'),
        tx('2', '2026-05-11', 5000, 'income'),
      ],
    )
    const { result } = renderHook(() => usePeriodKpis('b1', today))
    expect(result.current.spent.actual).toBe(1000)
  })

  it('handles budget_amount = 0 without dividing by zero', () => {
    const zeroBudget = { ...overview, budget_amount: 0 }
    setMocks([zeroBudget], [tx('1', '2026-05-10', 500)])
    const { result } = renderHook(() => usePeriodKpis('b1', today))
    expect(result.current.pacing.utilizationPct).toBe(0)
    expect(result.current.spent.deltaPct).toBe(0)
    expect(result.current.avgDay.target).toBe(0)
    expect(Number.isFinite(result.current.avgDay.actual)).toBe(true)
  })

  it('avgDay.actual = spent / daysElapsed', () => {
    setMocks([overview], [tx('1', '2026-05-10', 1500)])
    const { result } = renderHook(() => usePeriodKpis('b1', today))
    expect(result.current.avgDay.actual).toBeCloseTo(100, 5)
  })
})
