import { ChevronRight, Receipt, Tags } from 'lucide-react'
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router'
import type { BudgetOverview } from '@/types/budget.types'
import { cn } from '@/lib/utils'
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
    title: 'Expenses',
    icon: Receipt,
    to: '/budget/$budgetId/expenses' as const,
  },
  {
    title: 'Allocations',
    icon: Tags,
    to: '/budget/$budgetId/allocations' as const,
  },
] as const

export function BudgetSidebarItem({ budget }: { budget: BudgetOverview }) {
  const navigate = useNavigate()
  const percentage =
    budget.budget_amount > 0
      ? Math.round((budget.total_spent / budget.budget_amount) * 100)
      : 0

  const matchRoute = useMatchRoute()
  const isActive = !!matchRoute({
    to: '/budget/$budgetId',
    params: { budgetId: budget.budget_id },
    fuzzy: true,
  })

  const onClick = () => {
    navigate({
      to: '/budget/$budgetId',
      params: { budgetId: budget.budget_id },
    })
  }

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            onClick={onClick}
            tooltip={budget.budget_name}
            className="cursor-pointer group-data-[collapsible=icon]:p-1! hover:bg-transparent active:bg-transparent"
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary/10 text-primary hover:bg-primary/20',
              )}
            >
              {budget.budget_name.charAt(0).toUpperCase()}
            </span>
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
