import type { AuthedFetch } from '@/hooks/api/use-authed-fetch'
import type { AIInsightsResponse } from '@/types/insights.types'

export type InsightsServiceParams = {
  budget_id: string
  window: string
}

export const insightsService = {
  getIAInsights: async (
    api: AuthedFetch,
    params: InsightsServiceParams,
    signal?: AbortSignal,
  ): Promise<AIInsightsResponse> => {
    return api.get('/ai-insights', { params, signal })
  },
}
