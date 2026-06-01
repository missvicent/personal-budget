import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDeleteAccount } from '../use-delete-account'
import type { ReactNode } from 'react'

const signOutMock = vi.fn()
const navigateMock = vi.fn()
const { deleteSessionMock } = vi.hoisted(() => ({
  deleteSessionMock: vi.fn(),
}))

vi.mock('@clerk/clerk-react', () => ({
  useClerk: () => ({ signOut: signOutMock }),
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('@/services/delete-account.service', () => ({
  deleteAccountService: {
    delete: deleteSessionMock,
  },
}))

vi.mock('@/hooks/api/use-authed-fetch', () => ({
  useAuthedFetch: () => ({
    delete: deleteSessionMock,
  }),
}))

const renderWithClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return {
    ...renderHook(() => useDeleteAccount(), { wrapper }),
    client: queryClient,
  }
}

describe('useDeleteAccount', () => {
  beforeEach(() => {
    signOutMock.mockReset().mockResolvedValue(undefined)
    navigateMock.mockReset().mockResolvedValue(undefined)
    deleteSessionMock.mockReset()
  })

  it('on sucess: clears cache, signs out and navigates to /', async () => {
    deleteSessionMock.mockResolvedValue(undefined)
    const { client, result } = renderWithClient()
    const clearSpy = vi.spyOn(client, 'clear')

    await act(async () => {
      await result.current.mutateAsync()
    })

    await waitFor(() => {
      expect(deleteSessionMock).toHaveBeenCalled()
      expect(clearSpy).toHaveBeenCalled()
      expect(signOutMock).toHaveBeenCalled()
      expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
    })
  })

  it('on error: displays error message', async () => {
    deleteSessionMock.mockRejectedValue(new Error('boom'))
    const { result } = renderWithClient()
    await expect(result.current.mutateAsync()).rejects.toThrow('boom')
    expect(deleteSessionMock).toHaveBeenCalledTimes(1)
    expect(signOutMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
