import { UserButtonWithName } from '../UserButtonWithName'
import ThemeToggle from '../ThemeToggle'
import AppSidebarItem from './AppSidebarItem'
import AppSidebarHeader from './AppSidebarHeader'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'

export function AppSidebar({
  items,
}: {
  items: Array<{ title: string; url: string; icon: React.ElementType }>
}) {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <AppSidebarItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex-start flex gap-2 p-2">
        <UserButtonWithName />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
