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
          className="flex items-center"
          activeProps={{
            className:
              'bg-sidebar-item-active-bg text-sidebar-item-active-text font-semibold border-l-4 border-sidebar-item-active-border rounded-l-md',
          }}
        >
          <Icon className="text-sm" />
          <span className="text-sm">{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
