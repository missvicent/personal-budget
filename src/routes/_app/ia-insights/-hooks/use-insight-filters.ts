import { useMemo, useState } from 'react'
import type { BudgetOverview } from '@/types/database.types'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { toBudgetOptions } from '@/lib/mappers/budget'

type TimeRangeOption = { label: string; value: string }

const TIME_OPTIONS_BY_PERIOD: Record<
  BudgetOverview['period'],
  Array<TimeRangeOption>
> = {
  monthly: [
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
  ],
  yearly: [
    { label: '1Y', value: '1y' },
    { label: '3Y', value: '3y' },
    { label: '5Y', value: '5y' },
    { label: '10Y', value: '10y' },
  ],
}

export const useInsightFilters = () => {
  const { data: budgetOverviews } = useBudgetOverview()
  const [pickedBudgetId, setPickedBudgetId] = useState<string>('')
  const [pickedTime, setPickedTime] = useState<string>('')

  const budgetOptions = useMemo(
    () => toBudgetOptions(budgetOverviews ?? []),
    [budgetOverviews],
  )

  const firstBudget = budgetOverviews?.[0]
  const selectedBudget = pickedBudgetId || firstBudget?.budget_id || ''

  const selectedPeriod =
    budgetOverviews?.find((b) => b.budget_id === selectedBudget)?.period ??
    firstBudget?.period

  const timeOptions = selectedPeriod
    ? TIME_OPTIONS_BY_PERIOD[selectedPeriod]
    : []

  const selectedTime =
    timeOptions.find((o) => o.value === pickedTime)?.value ??
    timeOptions.at(0)?.value ??
    ''

  return {
    budgetOptions,
    selectedBudget,
    selectedTime,
    timeOptions,
    handleBudgetChange: (value: string) => {
      const next = budgetOverviews?.find((b) => b.budget_id === value)
      if (!next) return
      setPickedBudgetId(value)
      if (next.period !== selectedPeriod) {
        setPickedTime(TIME_OPTIONS_BY_PERIOD[next.period][0].value)
      }
    },
    handleTimeChange: (value: string) => {
      setPickedTime(value)
    },
  }
}
