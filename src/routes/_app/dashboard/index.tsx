import { createFileRoute } from '@tanstack/react-router'
import {
  Briefcase,
  Car,
  CreditCard,
  Home,
  Music,
  Receipt,
  Shirt,
  Zap,
} from 'lucide-react'
import { BudgetOverview, SummaryGrid } from './-components'
import type { SummaryGridProps } from './-components/SummaryGrid'
import type { BudgetOverviewProps } from './-components/BudgetOverview'

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
    amountSpent: 1000,
    additionalDescription: 'Total investments for the month',
  },
]

const budgetOverview: BudgetOverviewProps = {
  currentMonth: 'January 2026',
  categories: [
    {
      Icon: Receipt,
      category: 'Food',
      amountSpent: 300,
      amountBudget: 200,
    },
    {
      Icon: Car,
      category: 'Transport',
      amountSpent: 50,
      amountBudget: 100,
    },
    {
      Icon: Home,
      category: 'Housing',
      amountSpent: 75,
      amountBudget: 150,
    },
    {
      Icon: Zap,
      category: 'Utilities',
      amountSpent: 25,
      amountBudget: 50,
    },
    {
      Icon: Music,
      category: 'Entertainment',
      amountSpent: 10,
      amountBudget: 20,
    },
    {
      Icon: CreditCard,
      category: 'Clothing',
      amountSpent: 10,
      amountBudget: 20,
    },
    {
      Icon: Briefcase,
      category: 'Business',
      amountSpent: 10,
      amountBudget: 20,
    },
  ],
}
function RouteComponent() {
  return (
    <div className="min-h-screen p-8">
      <SummaryGrid summaryData={summaryData} />
      <BudgetOverview
        categories={budgetOverview.categories}
        currentMonth={budgetOverview.currentMonth}
      />
    </div>
  )
}
