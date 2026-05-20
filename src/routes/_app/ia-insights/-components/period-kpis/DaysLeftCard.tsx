import { Bar, BarChart, ResponsiveContainer } from 'recharts'
import { KpiCard } from './KpiCard'
import type { DailyPoint } from '@/hooks/insights/use-period-kpis'

type DaysLeftCardProps = {
  daysLeft: number
  daily: ReadonlyArray<DailyPoint>
  isLoading?: boolean
}

export const DaysLeftCard = ({
  daysLeft,
  daily,
  isLoading,
}: DaysLeftCardProps) => {
  return (
    <KpiCard
      label="DAYS LEFT"
      isLoading={isLoading}
      value={daysLeft}
      subText={<span className="text-muted-foreground">to period end</span>}
      viz={
        <ResponsiveContainer width="100%" height={36}>
          <BarChart data={[...daily]}>
            <Bar
              dataKey="amount"
              fill="var(--color-muted-foreground)"
              fillOpacity={0.45}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      }
    />
  )
}
