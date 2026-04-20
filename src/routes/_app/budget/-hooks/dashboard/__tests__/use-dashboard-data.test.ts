import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDashboardData } from '../use-dashboard-data'
import type {
  BudgetOverview,
  BudgetWithProgress,
  TransactionWithCategory,
} from '@/types/database.types'

vi.mock('@/hooks/budget/use-budget-overview', () => ({
  useBudgetOverview: vi.fn(),
}))
vi.mock('@/hooks/allocation/use-allocation', () => ({
  useAllocations: vi.fn(),
}))
vi.mock('@/hooks/transactions/use-transaction-with-categories', () => ({
  useGetTransactionsWithCategories: vi.fn(),
}))

const { useBudgetOverview } = await import('@/hooks/budget/use-budget-overview')
const { useAllocations } = await import('@/hooks/allocation/use-allocation')
const { useGetTransactionsWithCategories } = await import(
  '@/hooks/transactions/use-transaction-with-categories'
)

function mockQuery<TResult>(data: unknown, isLoading = false): TResult {
  return { data, isLoading, isError: false, error: null } as unknown as TResult
}

const overview: BudgetOverview = {
  budget_id: 'b1',
  budget_name: 'Test',
  budget_amount: 3000,
  period: 'monthly',
  start_date: '2026-04-01',
  end_date: '2026-04-30',
  is_active: true,
  total_spent: 1500,
}

describe('useDashboardData', () => {
  it('returns isLoading=true when any underlying query is loading', () => {
    vi.mocked(useBudgetOverview).mockReturnValue(
      mockQuery<ReturnType<typeof useBudgetOverview>>([overview], true),
    )
    vi.mocked(useAllocations).mockReturnValue(
      mockQuery<ReturnType<typeof useAllocations>>(
        [] as Array<BudgetWithProgress>,
      ),
    )
    vi.mocked(useGetTransactionsWithCategories).mockReturnValue(
      mockQuery<ReturnType<typeof useGetTransactionsWithCategories>>(
        [] as Array<TransactionWithCategory>,
      ),
    )

    const { result } = renderHook(() =>
      useDashboardData('b1', new Date('2026-04-15T12:00:00Z')),
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('composes summary, spotlight, categories, activity, and burn series when all queries resolved', () => {
    const allocation: BudgetWithProgress = {
      budget_id: 'b1',
      budget_name: 'Test',
      budget_amount: 3000,
      period: 'monthly',
      start_date: '2026-04-01',
      end_date: '2026-04-30',
      is_active: true,
      allocation_id: 'a1',
      category_id: 'c1',
      goal_id: null,
      amount: 300,
      alert_enabled: false,
      alert_threshold: 0,
      category_name: 'Food',
      category_type: 'expense',
      category_color: '#064E3B',
      category_icon: '🛒',
      goal_name: null,
      progress: 120,
    }

    vi.mocked(useBudgetOverview).mockReturnValue(
      mockQuery<ReturnType<typeof useBudgetOverview>>([overview]),
    )
    vi.mocked(useAllocations).mockReturnValue(
      mockQuery<ReturnType<typeof useAllocations>>([allocation]),
    )
    vi.mocked(useGetTransactionsWithCategories).mockReturnValue(
      mockQuery<ReturnType<typeof useGetTransactionsWithCategories>>(
        [] as Array<TransactionWithCategory>,
      ),
    )

    const { result } = renderHook(() =>
      useDashboardData('b1', new Date('2026-04-15T12:00:00Z')),
    )

    expect(result.current.isLoading).toBe(false)
    // budget 3000, spent 1500, day 15 of 30: expected = 1500, variance = 0
    expect(result.current.summary.paceVariance).toBe(0)
    expect(result.current.summary.remaining).toBe(1500)
    expect(result.current.summary.overBudgetAmount).toBeNull()
    expect(result.current.budgetAmount).toBe(3000)
    expect(result.current.burnSeries).toHaveLength(30)
    expect(result.current.spotlight).not.toBeNull()
    expect(result.current.spotlight?.name).toBe('Food')
    expect(result.current.spotlight?.mode).toBe('top-spender')
  })

  it('returns a zeroed summary and null spotlight when the budget overview row is missing', () => {
    vi.mocked(useBudgetOverview).mockReturnValue(
      mockQuery<ReturnType<typeof useBudgetOverview>>([]),
    )
    vi.mocked(useAllocations).mockReturnValue(
      mockQuery<ReturnType<typeof useAllocations>>(
        [] as Array<BudgetWithProgress>,
      ),
    )
    vi.mocked(useGetTransactionsWithCategories).mockReturnValue(
      mockQuery<ReturnType<typeof useGetTransactionsWithCategories>>(
        [] as Array<TransactionWithCategory>,
      ),
    )

    const { result } = renderHook(() =>
      useDashboardData('missing', new Date('2026-04-15T12:00:00Z')),
    )

    expect(result.current.summary.paceVariance).toBeNull()
    expect(result.current.summary.remaining).toBe(0)
    expect(result.current.summary.overBudgetAmount).toBeNull()
    expect(result.current.summary.dailyAverage).toBeNull()
    expect(result.current.spotlight).toBeNull()
    expect(result.current.budgetAmount).toBe(0)
    expect(result.current.burnSeries).toEqual([])
  })
})
