import { AdviceCard } from './AdviceCard'
import type { AdviceCardProps } from './AdviceCard'
import type {
  AIRecommendation,
  Anomaly,
  AnomalySeverity,
  InsightSummary,
} from '@/types/insights.types'
import { currencyFormatter } from '@/lib/format'

type AdviceCardsProps = {
  summary: InsightSummary | undefined
  ai: AIRecommendation | undefined
  isLoading: boolean
}

type AdviceItem = Omit<AdviceCardProps, 'isLoading'>

const SEVERITY_ORDER: Record<AnomalySeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

const topAnomaly = (anomalies: Array<Anomaly>): Anomaly | undefined =>
  [...anomalies].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  )[0]

const formatChangePct = (pct: number | null | undefined): string | null => {
  if (pct === null || pct === undefined) return null
  const sign = pct > 0 ? '+' : ''
  return `${sign}${Math.round(pct)}%`
}

const formatAnomalyBody = (anomaly: Anomaly): string => {
  if (anomaly.amount === null) return anomaly.message
  return `${anomaly.message} — ${currencyFormatter.format(anomaly.amount)}`
}

const outlierItem = (summary: InsightSummary | undefined): AdviceItem => {
  const top = summary ? topAnomaly(summary.anomalies) : undefined
  if (!top) return { variant: 'outlier', title: null, body: null }
  return {
    variant: 'outlier',
    title: top.category_name,
    body: formatAnomalyBody(top),
  }
}

const patternItem = (summary: InsightSummary | undefined): AdviceItem => {
  const top = summary?.patterns[0]
  if (!top) return { variant: 'pattern', title: null, body: null }
  return { variant: 'pattern', title: top.category_name, body: top.message }
}

const buildItems = (
  summary: InsightSummary | undefined,
  ai: AIRecommendation | undefined,
): Array<AdviceItem> => [
  {
    variant: 'burn_rate',
    body: ai?.problems ?? null,
    badge: formatChangePct(summary?.expenses_change_pct),
  },
  outlierItem(summary),
  patternItem(summary),
  {
    variant: 'opportunity',
    body: ai?.recommendations || ai?.one_action || null,
  },
]

export const AdviceCards = ({ summary, ai, isLoading }: AdviceCardsProps) => (
  <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
    {buildItems(summary, ai).map((item) => (
      <AdviceCard key={item.variant} {...item} isLoading={isLoading} />
    ))}
  </div>
)
