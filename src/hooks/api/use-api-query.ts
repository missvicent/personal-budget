import { useQuery } from '@tanstack/react-query'
import { useAuthedFetch } from './use-authed-fetch'
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import type { AuthedFetch } from './use-authed-fetch'

export const useApiQuery = <T>(
  queryKey: QueryKey,
  queryFn: (api: AuthedFetch, signal?: AbortSignal) => Promise<T>,
  queryOptions: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) => {
  const api = useAuthedFetch()
  return useQuery<T, Error, T>({
    queryKey,
    queryFn: ({
      signal,
    }: {
      signal?: AbortSignal
      params?: Record<string, string>
    }) => queryFn(api, signal),
    ...queryOptions,
    enabled: queryOptions.enabled ?? true,
  })
}
