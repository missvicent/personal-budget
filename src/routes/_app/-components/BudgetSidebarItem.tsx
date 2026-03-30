import { ChevronRight, LayoutDashboard, Receipt, Tags } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { BudgetOverview } from '@/types/budget.types'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

const BUDGET_SUB_LINKS = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    to: '/budget/$budgetId/dashboard' as const,
  },
  {
    title: 'Expenses',
    icon: Receipt,
    to: '/budget/$budgetId/expenses' as const,
  },
  {
    title: 'Categories',
    icon: Tags,
    to: '/budget/$budgetId/categories' as const,
  },
] as const

export function BudgetSidebarItem({ budget }: { budget: BudgetOverview }) {
  const percentage =
    budget.budget_amount > 0
      ? Math.round((budget.total_spent / budget.budget_amount) * 100)
      : 0

  return (
    <Collapsible asChild className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={budget.budget_name}>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: '#7c3aed' }}
            />
            <span className="truncate">{budget.budget_name}</span>
            <span className="text-muted-foreground ml-auto text-xs">
              {percentage}%
            </span>
            <ChevronRight className="ml-1 h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {BUDGET_SUB_LINKS.map((link) => (
              <SidebarMenuSubItem key={link.title}>
                <SidebarMenuSubButton asChild>
                  <Link
                    to={link.to}
                    params={{ budgetId: budget.budget_id }}
                    activeProps={{ className: 'text-primary font-semibold' }}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
