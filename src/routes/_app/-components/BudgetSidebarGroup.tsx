import { Plus } from 'lucide-react'
import { useState } from 'react'
import { BudgetSidebarItem } from './BudgetSidebarItem'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'
import { BudgetForm } from '@/components/budget'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { useBudgetHandlers } from '@/hooks/budget/use-budget-handlers'

export function BudgetSidebarGroup() {
  const { data: budgets } = useBudgetOverview()
  const [open, setOpen] = useState(false)
  const { handleSubmit, isPending } = useBudgetHandlers(null, () =>
    setOpen(false),
  )
  const budgetList = budgets ?? []

  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Budgets</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {budgetList.map((budget) => (
            <BudgetSidebarItem key={budget.budget_id} budget={budget} />
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpen(true)}
              className="text-muted-foreground"
            >
              <Plus className="h-4 w-4" />
              <span>New budget</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <ResponsiveDialog open={open} onOpenChange={setOpen}>
        <BudgetForm
          open={open}
          selectedBudget={null}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </ResponsiveDialog>
    </SidebarGroup>
  )
}
