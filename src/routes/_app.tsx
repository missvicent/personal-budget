import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import {
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  MoonIcon,
  Receipt,
  RefreshCcw,
  SunIcon,
  Zap,
} from 'lucide-react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/common/AppSidebar/AppSidebar'
import { useTheme } from '@/hooks/use-theme'
import ThemeToggle from '@/components/common/ThemeToggle'

function AppLayout() {
  const { toggleTheme, isDarkMode } = useTheme()
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
        <header className="bg-sidebar border-sidebar-border flex h-[72px] shrink-0 items-center border-b-2 p-4">
          <div className="flex w-full items-center justify-end gap-2">
            <ThemeToggle />
          </div>
        </header>
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
