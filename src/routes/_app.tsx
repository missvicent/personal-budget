import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import {
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  Receipt,
  RefreshCcw,
  Zap,
} from 'lucide-react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/common/AppSidebar/AppSidebar'
import AppToolbar from '@/components/common/AppToolbar'

function AppLayout() {
  // Menu items.
  const items = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Transactions',
      url: '/transactions',
      icon: Receipt,
    },
    {
      title: 'Budget',
      url: '/budget',
      icon: BarChart3,
    },
    {
      title: 'Recurring Expenses',
      url: '/recurring-expenses',
      icon: RefreshCcw,
    },
    {
      title: 'Goal Tracker',
      url: '/goal-tracker',
      icon: Zap,
    },
    {
      title: 'AI Insights',
      url: '/ia-insights',
      icon: Lightbulb,
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar items={items} />
      <SidebarInset className="h-screen flex-col">
        <AppToolbar />
        <main className="bg-sidebar flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect: location.href },
      })
    }
  },
  component: AppLayout,
})
