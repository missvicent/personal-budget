import { Link } from '@tanstack/react-router'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export default function AppSidebarItem({
  item,
}: {
  item: { title: string; url: string; icon: React.ElementType }
}) {
  const { title, url, icon } = item
  const Icon = icon
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={title}
        className="group-data-[collapsible=icon]:p-1!"
      >
        <Link
          to={url}
          activeProps={{
            className:
              'bg-sidebar-item-active-bg text-sidebar-item-active-text font-semibold',
          }}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            <Icon className="h-4 w-4" />
          </span>
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
