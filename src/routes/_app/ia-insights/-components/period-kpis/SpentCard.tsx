import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { KpiCard } from './KpiCard'
import type { DailyPoint } from '@/hooks/insights/use-period-kpis'
import { currencyFormatter } from '@/lib/format'

type SpentCardProps = {
  actual: number
  budget: number
  deltaPct: number
  daily: ReadonlyArray<DailyPoint>
  isLoading?: boolean
}

export const SpentCard = ({
  actual,
  budget,
  deltaPct,
  daily,
  isLoading,
}: SpentCardProps) => {
  const isOver = budget > 0 && actual > budget
  const hasBudget = budget > 0
  const TrendIcon = deltaPct >= 0 ? TrendingUp : TrendingDown

  let cumulative = 0
  const cumulativeData = daily.map((d) => {
    cumulative += d.amount
    return { date: d.date, total: cumulative }
  })

  return (
    <KpiCard
      label="SPENT THIS PERIOD"
      isLoading={isLoading}
      value={
        <span className={isOver ? 'text-destructive' : undefined}>
          {currencyFormatter.format(actual)}
        </span>
      }
      subText={
        hasBudget ? (
          <span
            className={
              isOver
                ? 'text-destructive flex items-center gap-1'
                : 'flex items-center gap-1 text-emerald-600 dark:text-emerald-400'
            }
          >
            <TrendIcon className="h-3 w-3" />
            {deltaPct >= 0 ? '+' : ''}
            {Math.round(deltaPct)}% vs {currencyFormatter.format(budget)} budget
          </span>
        ) : null
      }
      viz={
        <ResponsiveContainer width="100%" height={36}>
          <AreaChart data={cumulativeData}>
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.18}
              strokeWidth={1.5}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      }
    />
  )
}
