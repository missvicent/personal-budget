import { createFileRoute } from '@tanstack/react-router'
import { SummaryGrid } from './-components'
import type { SummaryGridProps } from './-components/SummaryGrid'

export const Route = createFileRoute('/_app/dashboard/')({
  component: RouteComponent,
})

const summaryData: SummaryGridProps['summaryData'] = [
  {
    title: 'Total Expenses',
    percentage: 10,
    badgeType: 'positive',
    amountSpent: 1000,
    additionalDescription: 'Total expenses for the month',
  },
  {
    title: 'Total Income',
    percentage: 10,
    badgeType: 'positive',
    amountSpent: 1000,
    additionalDescription: 'Total income for the month',
  },
  {
    title: 'Total Savings',
    percentage: 10,
    badgeType: 'positive',
    amountSpent: 1000,
    additionalDescription: 'Total savings for the month',
  },
  {
    title: 'Total Investments',
    percentage: 10,
    badgeType: 'positive',
    amountSpent: 1000,
    additionalDescription: 'Total investments for the month',
  },
]
function RouteComponent() {
  return (
    <div className="min-h-screen p-8">
      <SummaryGrid summaryData={summaryData} />
    </div>
  )
}
