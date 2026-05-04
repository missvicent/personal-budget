import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from './error'

export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(getErrorMessage(error))
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(getErrorMessage(error))
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  })
}

export const queryClient = createQueryClient()
