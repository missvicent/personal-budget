import { useMutation } from '@tanstack/react-query'
import { useAuthedFetch } from './use-authed-fetch'
import type { UseMutationOptions } from '@tanstack/react-query'
import type { AuthedFetch } from './use-authed-fetch'

export const useApiMutation = <TData, TVariables, TError, TContext>(
  mutationFn: (api: AuthedFetch, variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >,
) => {
  const api = useAuthedFetch()
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (variables) => mutationFn(api, variables),
    ...options,
  })
}
