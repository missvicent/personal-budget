import { createFileRoute } from '@tanstack/react-router'
import {
  Briefcase,
  Car,
  CreditCard,
  Home,
  Music,
  Receipt,
  Zap,
} from 'lucide-react'
import { BudgetOverview, RecentActivity, SummaryGrid } from './-components'
import type { SummaryGridProps } from './-components/SummaryGrid'
import type { BudgetOverviewProps } from './-components/BudgetOverview'
import type { RecentActivityByCategory } from './-components/RecentActivity'

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
      id: '1',
      Icon: Receipt,
      category: 'Food',
      amountSpent: 300,
      amountBudget: 200,
      color: '#064E3B',
    },
    {
      id: '2',
      Icon: Car,
      category: 'Transport',
      amountSpent: 50,
      amountBudget: 100,
      color: '#064E3B',
    },
    {
      id: '3',
      Icon: Home,
      category: 'Housing',
      amountSpent: 75,
      amountBudget: 150,
      color: '#064E3B',
    },
    {
      id: '4',
      Icon: Zap,
      category: 'Utilities',
      amountSpent: 25,
      amountBudget: 50,
      color: '#064E3B',
    },
    {
      id: '5',
      Icon: Music,
      category: 'Entertainment',
      amountSpent: 10,
      amountBudget: 20,
      color: '#064E3B',
    },
    {
      id: '6',
      Icon: CreditCard,
      category: 'Clothing',
      amountSpent: 10,
      amountBudget: 20,
      color: '#064E3B',
    },
    {
      id: '7',
      Icon: Briefcase,
      category: 'Business',
      amountSpent: 10,
      amountBudget: 20,
      color: '#064E3B',
    },
  ],
}

const recentActivity: Array<RecentActivityByCategory> = [
  {
    id: '1',
    amountSpent: 100,
    category: 'Food',
    color: '#064E3B',
    date: '2026-01-01',
    Icon: Receipt,
    title: 'Food',
  },
]
function RouteComponent() {
  return (
    <div className="min-h-screen p-8">
      <SummaryGrid summaryData={summaryData} />
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2">
        <BudgetOverview
          categories={budgetOverview.categories}
          currentMonth={budgetOverview.currentMonth}
        />
        <RecentActivity recentActivity={recentActivity} />
      </div>
    </div>
  )
}
