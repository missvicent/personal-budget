import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { KpiCard } from './KpiCard'
import type { DailyPoint } from '@/hooks/insights/use-period-kpis'
import { currencyFormatter } from '@/lib/format'

type AvgDayCardProps = {
  actual: number
  target: number
  diff: number
  daily: ReadonlyArray<DailyPoint>
  isLoading?: boolean
}

export const AvgDayCard = ({
  actual,
  target,
  diff,
  daily,
  isLoading,
}: AvgDayCardProps) => {
  const hasTarget = target > 0
  const above = diff > 0
  const TrendIcon = above ? TrendingUp : TrendingDown
  const colorClass = above
    ? 'text-destructive'
    : 'text-emerald-600 dark:text-emerald-400'

  return (
    <KpiCard
      label="AVG / DAY"
      isLoading={isLoading}
      value={currencyFormatter.format(actual)}
      subText={
        hasTarget ? (
          <span className={`flex items-center gap-1 ${colorClass}`}>
            <TrendIcon className="h-3 w-3" />
            {above ? '+' : '−'}
            {currencyFormatter.format(Math.abs(diff))}{' '}
            {above ? 'above target' : 'below target'}
          </span>
        ) : null
      }
      viz={
        <ResponsiveContainer width="100%" height={36}>
          <LineChart data={[...daily]}>
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--color-foreground)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      }
    />
  )
}
