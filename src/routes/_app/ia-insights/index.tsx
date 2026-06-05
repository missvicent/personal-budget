import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AdviceCards,
  EmptyInsightsState,
  InsightsSkeleton,
  PeriodKpiGrid,
  SelectBudgetPrompt,
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
  const hasSelection = !!selectedBudget
  const canRunInsights = hasSelection && totals.has_transactions

  const { data: insightsData, isLoading: isInsightsLoading } = useIAInsights(
    { budget_id: selectedBudget, window: selectedTime },
    { enabled: canRunInsights },
  )

  const renderState = () => {
    if (!hasBudgets) return <EmptyInsightsState reason="no_budgets" />
    if (!hasSelection) return <SelectBudgetPrompt />
    if (totals.isLoading) return <InsightsSkeleton />
    if (!totals.has_transactions)
      return (
        <EmptyInsightsState
          reason="no_transactions"
          budgetId={selectedBudget}
        />
      )

    return (
      <>
        <div className="flex w-full px-5">
          <PeriodKpiGrid budgetId={selectedBudget} />
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
    )
  }

  return (
    <div className="flex h-full w-full flex-col gap-3">
      {hasBudgets && (
        <div className="flex flex-wrap items-center gap-3 px-5 pt-4">
          <div className="w-full sm:w-fit">
            <BudgetSelector
              items={budgetOptions}
              onChange={handleBudgetChange}
              value={selectedBudget}
            />
          </div>
          {hasSelection && (
            <div className="w-full sm:w-auto">
              <TimeRangeSelector
                options={timeOptions}
                value={selectedTime}
                onValueChange={handleTimeChange}
              />
            </div>
          )}
        </div>
      )}

      {renderState()}
    </div>
  )
}
