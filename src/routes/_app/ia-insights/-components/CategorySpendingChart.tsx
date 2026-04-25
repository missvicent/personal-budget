import { Pie, PieChart } from 'recharts'
import { CategorySpendingLegend } from './CategorySpendingLegend'
import type { CategorySpendingLegendItem } from './CategorySpendingLegend'
import type { ChartConfig } from '@/components/ui/chart'
import type { BudgetWithProgress } from '@/types/budget.types'
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
import { Skeleton } from '@/components/ui/skeleton'

const toLegendItem = (
  allocation: BudgetWithProgress,
): CategorySpendingLegendItem => ({
  name: allocation.category_name ?? '',
  value: allocation.category_name ?? '',
  color: allocation.category_color ?? '',
  amount: allocation.progress,
  icon: allocation.category_icon ?? '',
  budget: allocation.budget_amount || 0,
})

export const CategorySpendingChart = ({
  chartConfig,
  chartData,
  allocations,
  isLoading = false,
}: {
  chartData: Array<{ category: string; amount: number; fill: string }>
  chartConfig: ChartConfig
  allocations: Array<BudgetWithProgress>
  isLoading?: boolean
}) => {
  const legendData = allocations.map(toLegendItem)
  const hasAllocations = legendData.length > 0
  const hasSpending = chartData.length > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-content-foreground text-base">
          Where the money went
        </CardTitle>
        <CardDescription>Categories ranked by spent.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 xl:flex-row">
        {isLoading && (
          <>
            <div className="flex flex-1 items-center justify-center">
              <Skeleton className="aspect-square h-72 rounded-full" />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </>
        )}
        {!isLoading && !hasAllocations && (
          <p className="text-muted-foreground text-sm">No categories found</p>
        )}
        {!isLoading && hasAllocations && !hasSpending && (
          <div className="flex w-full flex-col gap-3">
            <p className="text-muted-foreground text-sm">
              No spending yet — amounts will appear as you track expenses.
            </p>
            <CategorySpendingLegend items={legendData} />
          </div>
        )}
        {!isLoading && hasAllocations && hasSpending && (
          <>
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
            <CategorySpendingLegend items={legendData} />
          </>
        )}
      </CardContent>
    </Card>
  )
}
