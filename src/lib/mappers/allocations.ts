import type { ChartConfig } from '@/components/ui/chart'
import type { BudgetWithProgress } from '@/types/budget.types'

const orEmpty = (value: string | null | undefined) => value ?? ''

const toChartEntry = (allocation: BudgetWithProgress) => {
  const color = orEmpty(allocation.category_color)
  return {
    category: orEmpty(allocation.category_name),
    amount: allocation.progress,
    fill: color,
    icon: orEmpty(allocation.category_icon),
    color,
    budget: allocation.budget_amount || 0,
  }
}

const toConfigEntry = (
  config: ChartConfig,
  allocation: BudgetWithProgress,
): ChartConfig => {
  const key = orEmpty(allocation.category_name)
  config[key] = { label: key, color: orEmpty(allocation.category_color) }
  return config
}

export const toAllocationChartData = (allocations: Array<BudgetWithProgress>) =>
  allocations.filter((a) => a.progress > 0).map(toChartEntry)

export const toAllocationChartConfig = (
  allocations: Array<BudgetWithProgress>,
): ChartConfig =>
  allocations.reduce<ChartConfig>(
    (config, allocation) => toConfigEntry(config, allocation),
    {},
  )
