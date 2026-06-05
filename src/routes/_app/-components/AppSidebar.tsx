import { AppSidebarHeader } from './AppSidebarHeader'
import AppSidebarItem from './AppSidebarItem'
import { BudgetSidebarGroup } from './BudgetSidebarGroup'
import { AccountUserButton } from '@/components/common/AccountUserButton'
import { GENERAL_NAV_ITEMS } from '@/config/navigation'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import ThemeToggle from '@/components/common/ThemeToggle'

export const AppSidebar = () => {
  const { data: budgets } = useBudgetOverview()
  const hasBudgets = (budgets?.length ?? 0) > 0
  const generalNavItems = GENERAL_NAV_ITEMS.filter((item) =>
    !hasBudgets ? true : item.title !== 'Overview',
  )

  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalNavItems.map((item) => (
                <AppSidebarItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <BudgetSidebarGroup />
      </SidebarContent>
      <SidebarFooter className="flex-start flex gap-2 p-2">
        <div className="flex items-center justify-center gap-2">
          <AccountUserButton />
        </div>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
