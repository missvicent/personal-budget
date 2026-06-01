import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBudgetHandlers } from '../use-budget-handlers'
import type { ReactNode } from 'react'
import type { Budget } from '@/types/database.types'

const navigateMock = vi.fn()
const createMock = vi.fn()
const updateMock = vi.fn()
const removeMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../use-budget-mutations', () => ({
  useBudgetMutations: () => ({
    create: createMock,
    update: updateMock,
    remove: removeMock,
    isCreating: false,
    isUpdating: false,
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const renderWithClient = (selectedBudget: Budget | null = null) => {
  const queryClient = new QueryClient()
  const onSuccess = vi.fn()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return {
    ...renderHook(() => useBudgetHandlers(selectedBudget, onSuccess), {
      wrapper,
    }),
    onSuccess,
  }
}

const formData = {
  name: 'Groceries',
  amount: 500,
  period: 'monthly',
  start_date: new Date('2026-05-01').toISOString(),
} as unknown as Parameters<
  ReturnType<typeof useBudgetHandlers>['handleSubmit']
>[0]

const createdBudget = { id: 'budget-123' } as Budget

describe('useBudgetHandlers', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    createMock.mockReset()
    updateMock.mockReset()
    removeMock.mockReset()
  })

  it('navigates to the new budget dashboard after a successful create', async () => {
    createMock.mockImplementation((_payload, options) => {
      options.onSuccess(createdBudget)
    })
    const { result, onSuccess } = renderWithClient(null)

    await act(() => {
      result.current.handleSubmit(formData, {})
    })

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/budget/$budgetId',
        params: { budgetId: 'budget-123' },
      })
    })
  })

  it('does not navigate on update', async () => {
    updateMock.mockImplementation((_payload, options) => {
      options.onSuccess()
    })
    const { result } = renderWithClient({ id: 'existing-1' } as Budget)

    await act(() => {
      result.current.handleSubmit(formData, { name: true })
    })

    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('does not navigate when create fails (onSuccess not called)', async () => {
    createMock.mockImplementation(() => {
      // mutation rejected → options.onSuccess never invoked
    })
    const { result } = renderWithClient(null)

    await act(() => {
      result.current.handleSubmit(formData, {})
    })

    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('does not navigate when created budget has no id', async () => {
    createMock.mockImplementation((_payload, options) => {
      options.onSuccess({} as Budget)
    })
    const { result } = renderWithClient(null)

    await act(() => {
      result.current.handleSubmit(formData, {})
    })

    expect(navigateMock).not.toHaveBeenCalled()
  })
})
