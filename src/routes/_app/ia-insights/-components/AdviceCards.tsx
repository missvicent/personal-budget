import { AdviceRow } from './AdviceRow'
import type { AdviceRowProps } from './AdviceRow'
import type {
  AIRecommendation,
  Anomaly,
  AnomalySeverity,
  InsightSummary,
} from '@/types/insights.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { currencyFormatter } from '@/lib/format'

type AdviceCardsProps = {
  summary: InsightSummary | undefined
  ai: AIRecommendation | undefined
  isLoading: boolean
}

type AdviceItem = Omit<AdviceRowProps, 'isLoading'>

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
  <Card className="w-full">
    <CardHeader className="flex flex-col items-start">
      <CardTitle className="text-content-foreground flex items-start gap-2">
        <span className="text-base">Insights</span>
        <span className="text-muted-foreground text-sm">by AI</span>
      </CardTitle>
      <CardDescription>
        Patterns, outliers, and opportunities detected this period
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="divide-border flex flex-col divide-y">
        {buildItems(summary, ai).map((item) => (
          <AdviceRow key={item.variant} {...item} isLoading={isLoading} />
        ))}
      </div>
    </CardContent>
  </Card>
)
