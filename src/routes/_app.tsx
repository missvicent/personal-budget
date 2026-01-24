import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import {
  Brain,
  ChartNoAxesCombined,
  ClipboardList,
  House,
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
      icon: House,
    },
    {
      title: 'Expenses',
      url: '/expenses',
      icon: ClipboardList,
    },
    {
      title: 'Budgets',
      url: '/budget',
      icon: ChartNoAxesCombined,
    },
    {
      title: 'Goal Tracker',
      url: '/goal-tracker',
      icon: Zap,
    },
    {
      title: 'AI Insights',
      url: '/ia-insights',
      icon: Brain,
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar items={items} />
      <SidebarInset className="h-screen flex-col">
        <AppToolbar />
        <main className="dark:bg-sidebar flex-1 overflow-auto">
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
