import { createFileRoute } from '@tanstack/react-router'
import {
  budgetOverview,
  recentActivity,
  summaryData,
} from '../-data/dashboard-mock'
import {
  RecentActivity,
  SpendingByCategory,
  SummaryGrid,
} from '@/routes/_app/dashboard/-components'

export const Route = createFileRoute('/_app/budget/$budgetId/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <SummaryGrid summaryData={summaryData} />
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2">
        <SpendingByCategory
          categories={budgetOverview.categories}
          currentMonth={budgetOverview.currentMonth}
        />
        <RecentActivity recentActivity={recentActivity} />
      </div>
    </div>
  )
}
