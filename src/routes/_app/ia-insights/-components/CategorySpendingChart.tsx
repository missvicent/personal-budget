import { Pie, PieChart } from 'recharts'
import type { ChartConfig } from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { currencyFormatter } from '@/lib/format'

export const CategorySpendingChart = ({
  chartConfig,
  chartData,
}: {
  chartData: Array<{ category: string; amount: number; fill: string }>
  chartConfig: ChartConfig
}) => {
  const total = chartData.reduce((acc, curr) => acc + curr.amount, 0)

  const legendData = Object.entries(chartConfig).map(([key, value]) => ({
    name: value.label,
    value: key,
    color: value.color,
    amount: chartData.find((item) => item.category === key)?.amount ?? 0,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-content-foreground text-base">
          Where the money went
        </CardTitle>
        <CardDescription>Categories ranked by spent.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 xl:flex-row">
        <div className="flex-1">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-72"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex-1 flex-col items-start justify-center">
          {legendData.map((item) => (
            <div key={item.value} className="flex w-full flex-col items-start">
              <div className="flex w-full items-center gap-2 py-3">
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ background: item.color }}
                />
                <div className="flex w-full justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {currencyFormatter.format(item.amount)}
                  </span>
                </div>
              </div>
              <Progress value={total > 0 ? (item.amount / total) * 100 : 0} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
