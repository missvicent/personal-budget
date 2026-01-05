import {
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  Receipt,
  RefreshCcw,
  Zap,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'

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

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-sidebar-border h-[72px] !flex-row items-center gap-2 border-b-2 px-6 py-6 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <img src="/logo.svg" alt="BudgetApp" className="h-8 w-8" />
          <p className="text-md leading-tight font-bold">Personal Budget</p>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-6 text-lg"
                    >
                      <item.icon className="text-lg" />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
