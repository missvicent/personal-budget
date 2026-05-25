import type { AuthedFetch } from '@/hooks/api/use-authed-fetch'

export const deleteAccountService = {
  delete: async (api: AuthedFetch, signal?: AbortSignal): Promise<void> => {
    return api.post('/account/delete', { signal })
  },
}
