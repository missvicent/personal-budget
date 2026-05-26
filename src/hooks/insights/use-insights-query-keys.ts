export const useIAInsightsQueryKeys = () => {
  return {
    insights: (budget_id: string, window: string) =>
      ['insights', budget_id, window] as const,
  }
}
