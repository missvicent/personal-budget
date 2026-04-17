import { format } from 'date-fns'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BurnSeriesPoint } from '@/routes/_app/budget/-hooks/dashboard/types'
import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer } from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { currencyFormatter } from '@/lib/format'

export interface BurnChartProps {
  series: Array<BurnSeriesPoint>
  budgetAmount: number
}

const CHART_CONFIG: ChartConfig = {
  actual: { label: 'Actual', color: 'var(--primary)' },
  pace: { label: 'Pace', color: 'var(--muted-foreground)' },
  projected: { label: 'Projected', color: 'var(--primary)' },
}

const findTodayIndex = (series: Array<BurnSeriesPoint>): number => {
  // "Today" is the last point where both actual is non-null AND projected is non-null.
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i].actual !== null && series[i].projected !== null) return i
  }
  return -1
}

const hasSpending = (series: Array<BurnSeriesPoint>): boolean =>
  series.some((p) => (p.actual ?? 0) > 0)

export const BurnChart = ({ series, budgetAmount }: BurnChartProps) => {
  const todayIndex = findTodayIndex(series)
  const todayDate = todayIndex >= 0 ? series[todayIndex].date : null

  const data = series.map((p) => ({
    dateKey: p.date.getTime(),
    dateLabel: format(p.date, 'MMM d'),
    actual: p.actual,
    pace: p.pace,
    projected: p.projected,
  }))

  return (
    <Card className="w-full gap-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Burn rate</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Cumulative spend vs. pace
        </CardDescription>
      </CardHeader>
      <CardContent className="relative h-120 pt-4">
        {!hasSpending(series) && (
          <p className="text-muted-foreground absolute inset-x-0 top-8 text-center text-sm">
            No spending yet
          </p>
        )}
        <ChartContainer config={CHART_CONFIG} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                minTickGap={24}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, Math.max(budgetAmount, 0)]}
                tickFormatter={(v) => currencyFormatter.format(v as number)}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip
                formatter={(value, name) => {
                  const numeric =
                    typeof value === 'number' ? value : Number(value)
                  const key = String(name)
                  const label = CHART_CONFIG[key].label ?? key
                  return [currencyFormatter.format(numeric), label]
                }}
              />
              <Line
                type="monotone"
                dataKey="pace"
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                type="stepAfter"
                dataKey="actual"
                stroke="var(--primary)"
                dot={false}
                strokeWidth={2}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="var(--primary)"
                strokeDasharray="2 4"
                strokeOpacity={0.55}
                dot={false}
                strokeWidth={1.5}
                connectNulls
              />
              {todayDate && (
                <ReferenceLine
                  x={format(todayDate, 'MMM d')}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Today',
                    position: 'insideTop',
                    fontSize: 11,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
