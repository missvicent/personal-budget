import { Sparkles } from 'lucide-react'
import type { Anomaly, AnomalySeverity } from '@/types/insights.types'
import { cn } from '@/lib/utils'
import { currencyFormatter } from '@/lib/format'

const isConsistent = (severity: AnomalySeverity) => severity === 'low'

export const AnomalyRow = ({ anomaly }: { anomaly: Anomaly }) => {
  const consistent = isConsistent(anomaly.severity)
  const tint = anomaly.color ?? undefined

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-base font-semibold"
        style={{
          backgroundColor: tint ? `${tint}20` : undefined,
          color: tint,
        }}
      >
        {anomaly.icon ?? ''}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-content-foreground truncate text-base font-semibold">
          {anomaly.category_name ?? 'Unknown'}
        </span>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Sparkles className="text-primary size-3 shrink-0" />
          <span className="truncate">{anomaly.message}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <span className="text-content-foreground text-sm font-semibold">
          {currencyFormatter.format(anomaly.amount ?? 0)}
        </span>
        <span
          className={cn(
            'text-xs',
            consistent ? 'text-green-600' : 'text-red-600',
          )}
        >
          {consistent ? 'Consistent with prior months' : 'Above typical'}
        </span>
      </div>
    </div>
  )
}
