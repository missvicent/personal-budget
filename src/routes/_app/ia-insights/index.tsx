import { createFileRoute } from '@tanstack/react-router'
import {
  CategorySpendingChart,
  InsightsSummary,
  TimeRangeSelector,
  TopOutliners,
} from './-components'
import { useInsightFilters } from './-hooks/use-insight-filters'
import { useBudgetAllocations } from './-hooks/use-budget-allocations-chart'
import type { Anomaly } from '@/types/insights.types'
import { BudgetSelector } from '@/components/shared/BudgetSelector'
import { staticToolbarMeta } from '@/lib/toolbar'

export const Route = createFileRoute('/_app/ia-insights/')({
  beforeLoad: staticToolbarMeta({
    title: 'AI Insights',
    description: 'Insights and spending patterns',
    balance: { label: 'Balance', value: '$0.00' },
  }),
  component: RouteComponent,
})

const insights = {
  totalSpending: 1000,
  totalIncome: 1500,
  totalExpenses: 500,
  totalNet: 1000,
}

const anomalies = [
  {
    id: '1',
    amount: 100,
    type: 'spike',
    category_name: 'Food',
    color: '#ff0000',
    icon: 'F',
    severity: 'low',
    message: 'Food spending is too high',
  },
  {
    id: '2',
    amount: 100,
    type: 'spike',
    category_name: 'Food',
    color: '#ff0000',
    icon: 'F',
    severity: 'medium',
    message: 'Food spending is too high',
  },
  {
    id: '3',
    amount: 100,
    type: 'spike',
    category_name: 'Food',
    color: '#ff0000',
    severity: 'high',
    message: 'Food spending is too high',
    icon: 'F',
  },
] satisfies Array<Anomaly>

function RouteComponent() {
  const {
    budgetOptions,
    handleBudgetChange,
    handleTimeChange,
    selectedBudget,
    selectedTime,
    timeOptions,
  } = useInsightFilters()

  const { allocations, chartData, chartConfig, isLoading } =
    useBudgetAllocations(selectedBudget)

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 px-5 pt-2">
        <div className="w-full sm:w-fit">
          <BudgetSelector
            items={budgetOptions}
            onChange={handleBudgetChange}
            value={selectedBudget}
          />
        </div>
        <div className="w-full sm:w-auto">
          <TimeRangeSelector
            options={timeOptions}
            value={selectedTime}
            onValueChange={handleTimeChange}
          />
        </div>
      </div>
      <div className="flex w-full px-5">
        <InsightsSummary insights={insights} isLoading={isLoading} />
      </div>
      <div className="flex w-full gap-3 px-5">
        <div className="flex w-full xl:w-1/2">
          <CategorySpendingChart
            chartData={chartData}
            chartConfig={chartConfig}
            allocations={allocations}
            isLoading={isLoading}
          />
        </div>
        <div className="flex w-full xl:w-1/2">
          <TopOutliners anomalies={anomalies} />
        </div>
      </div>
    </div>
  )
}
