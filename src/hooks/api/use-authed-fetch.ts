import { useCallback, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { RequestOptions } from '@/lib/api-client'
import { apiClient } from '@/lib/api-client'

export const useAuthedFetch = () => {
  const { getToken } = useAuth()

  const withToken = useCallback(
    async <T>(fn: (token: string) => Promise<T>): Promise<T> => {
      const token = await getToken()
      if (!token) throw new Error('No token found')
      return fn(token)
    },
    [getToken],
  )

  return useMemo(
    () => ({
      get: <T>(path: string, opts?: Omit<RequestOptions, 'token'>) =>
        withToken((token) => apiClient.get<T>(path, { ...opts, token })),
      post: <T>(
        path: string,
        opts?: Omit<RequestOptions, 'token'> & { body?: unknown },
      ) => withToken((token) => apiClient.post<T>(path, { ...opts, token })),
      put: <T>(
        path: string,
        opts?: Omit<RequestOptions, 'token'> & { body?: unknown },
      ) => withToken((token) => apiClient.put<T>(path, { ...opts, token })),
      delete: <T>(path: string, opts?: Omit<RequestOptions, 'token'>) =>
        withToken((token) => apiClient.delete<T>(path, { ...opts, token })),
    }),
    [withToken],
  )
}

export type AuthedFetch = ReturnType<typeof useAuthedFetch>
