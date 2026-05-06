import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AdviceCards,
  EmptyInsightsState,
  InsightsSummary,
  TimeRangeSelector,
  TopOutliners,
} from './-components'
import { useInsightFilters } from './-hooks/use-insight-filters'
import { BudgetSelector } from '@/components/shared/BudgetSelector'
import { Button } from '@/components/ui/button'
import { staticToolbarMeta } from '@/lib/toolbar'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { useInsightsTotals } from '@/hooks/insights/use-insights-totals'
import { useIAInsights } from '@/hooks/insights/use-insights'

export const Route = createFileRoute('/_app/ia-insights/')({
  beforeLoad: staticToolbarMeta({
    title: 'AI Insights',
    description: 'Insights and spending patterns',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const {
    budgetOptions,
    handleBudgetChange,
    handleTimeChange,
    selectedBudget,
    selectedTime,
    timeOptions,
  } = useInsightFilters()

  const { data: budgets } = useBudgetOverview()
  const totals = useInsightsTotals(selectedBudget, selectedTime)

  const hasBudgets = (budgets?.length ?? 0) > 0
  const canRunInsights = hasBudgets && totals.has_transactions

  const { data: insightsData, isLoading: isInsightsLoading } = useIAInsights(
    { budget_id: selectedBudget, window: selectedTime },
    { enabled: canRunInsights },
  )

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

      {!hasBudgets ? (
        <div className="flex w-full px-5">
          <EmptyInsightsState reason="no_budgets" />
        </div>
      ) : !totals.isLoading && !totals.has_transactions ? (
        <div className="flex w-full px-5">
          <EmptyInsightsState reason="no_transactions" />
        </div>
      ) : (
        <>
          <div className="flex w-full px-5">
            <InsightsSummary
              insights={{
                total_spending: totals.total_spending,
                total_income: totals.total_income,
                total_expenses: totals.total_expenses,
                net: totals.net,
              }}
              isLoading={totals.isLoading}
            />
          </div>
          <div className="flex w-full px-5">
            <AdviceCards
              summary={insightsData?.summary}
              ai={insightsData?.ai}
              isLoading={isInsightsLoading}
            />
          </div>
          <div className="flex w-full gap-3 px-5">
            <TopOutliners
              anomalies={insightsData?.summary.anomalies ?? []}
              isLoading={isInsightsLoading}
              headerAction={
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/budget/$budgetId/expenses"
                    params={{ budgetId: selectedBudget }}
                  >
                    View all transactions
                  </Link>
                </Button>
              }
            />
          </div>
        </>
      )}
    </div>
  )
}
