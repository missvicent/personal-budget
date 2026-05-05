import { useApiQuery } from '../api/use-api-query'
import { useIAInsightsQueryKeys } from './use-insights-query-keys'
import type { AIInsightsResponse } from '@/types/insights.types'
import type { InsightsServiceParams } from '@/services/insights.service'
import { insightsService } from '@/services/insights.service'

type UseIAInsightsOptions = {
  enabled?: boolean
}

export const useIAInsights = (
  params: InsightsServiceParams,
  options: UseIAInsightsOptions = {},
) => {
  const hasParams = !!params.budget_id && !!params.window
  const enabled = (options.enabled ?? true) && hasParams

  return useApiQuery<AIInsightsResponse>(
    useIAInsightsQueryKeys().insights(params.budget_id, params.window),
    async (api, signal?: AbortSignal) => {
      return insightsService.getIAInsights(api, params, signal)
    },
    {
      retry: false,
      enabled,
    },
  )
}
