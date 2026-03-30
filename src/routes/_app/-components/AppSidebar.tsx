import { AppSidebarHeader } from './AppSidebarHeader'
import AppSidebarItem from './AppSidebarItem'
import { BudgetSidebarGroup } from './BudgetSidebarGroup'
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
import { UserButtonWithName } from '@/components/common/UserButtonWithName'
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
        <UserButtonWithName />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
