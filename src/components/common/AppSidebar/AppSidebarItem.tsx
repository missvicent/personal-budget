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
          className="flex items-center gap-2"
          activeProps={{
            className:
              'border-l-4 border-purple-500 rounded-l-md text-purple-300 bg-purple-950/30 font-semibold',
          }}
        >
          <Icon className="text-lg" />
          <span className="text-md p-2">{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
