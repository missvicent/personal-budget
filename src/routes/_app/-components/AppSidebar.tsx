import { AppSidebarHeader } from './AppSidebarHeader'
import AppSidebarItem from './AppSidebarItem'
import { BudgetSidebarGroup } from './BudgetSidebarGroup'
import { AccountUserButton } from '@/components/common/AccountUserButton'
import { GENERAL_NAV_ITEMS } from '@/config/navigation'
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
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {GENERAL_NAV_ITEMS.map((item) => (
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
