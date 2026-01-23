import { Link } from '@tanstack/react-router'
import { SidebarMenuButton, SidebarMenuItem } from '../../ui/sidebar'

export default function AppSidebarItem({
  item,
}: {
  item: { title: string; url: string; icon: React.ElementType }
}) {
  const { title, url, icon } = item
  const Icon = icon
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <Link
          to={url}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-4"
        >
          <Icon className="text-md" />
          <span className="text-md">{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
