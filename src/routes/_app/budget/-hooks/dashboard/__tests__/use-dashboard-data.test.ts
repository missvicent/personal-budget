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

const mockQuery = <T>(data: T | undefined, isLoading = false) =>
  ({ data, isLoading, isError: false, error: null }) as unknown as ReturnType<
    typeof useBudgetOverview
  >

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
    vi.mocked(useBudgetOverview).mockReturnValue(mockQuery([overview], true))
    vi.mocked(useAllocations).mockReturnValue(
      mockQuery([] as Array<BudgetWithProgress>),
    )
    vi.mocked(useGetTransactionsWithCategories).mockReturnValue(
      mockQuery([] as Array<TransactionWithCategory>),
    )

    const { result } = renderHook(() =>
      useDashboardData('b1', new Date('2026-04-15T12:00:00Z')),
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('composes summary, categories, activity, and burn series when all queries resolved', () => {
    vi.mocked(useBudgetOverview).mockReturnValue(mockQuery([overview]))
    vi.mocked(useAllocations).mockReturnValue(
      mockQuery([] as Array<BudgetWithProgress>),
    )
    vi.mocked(useGetTransactionsWithCategories).mockReturnValue(
      mockQuery([] as Array<TransactionWithCategory>),
    )

    const { result } = renderHook(() =>
      useDashboardData('b1', new Date('2026-04-15T12:00:00Z')),
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.summary.budgetUsedPercent).toBeCloseTo(50, 5)
    expect(result.current.summary.remaining).toBe(1500)
    expect(result.current.budgetAmount).toBe(3000)
    expect(result.current.burnSeries).toHaveLength(30)
  })

  it('returns a zeroed summary when the budget overview row is missing', () => {
    vi.mocked(useBudgetOverview).mockReturnValue(mockQuery([]))
    vi.mocked(useAllocations).mockReturnValue(
      mockQuery([] as Array<BudgetWithProgress>),
    )
    vi.mocked(useGetTransactionsWithCategories).mockReturnValue(
      mockQuery([] as Array<TransactionWithCategory>),
    )

    const { result } = renderHook(() =>
      useDashboardData('missing', new Date('2026-04-15T12:00:00Z')),
    )

    expect(result.current.summary.budgetUsedPercent).toBe(0)
    expect(result.current.summary.remaining).toBe(0)
    expect(result.current.budgetAmount).toBe(0)
    expect(result.current.burnSeries).toEqual([])
  })
})
