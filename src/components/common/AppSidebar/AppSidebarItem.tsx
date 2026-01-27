import { Link } from '@tanstack/react-router'
import { SidebarMenuButton, SidebarMenuItem } from '../../ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={url}
              className="flex items-center"
              activeProps={{
                className:
                  'bg-sidebar-item-active-bg text-sidebar-item-active-text font-semibold border-l-4 border-sidebar-item-active-border rounded-l-md',
              }}
            >
              <Icon className="h-7 w-7" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-sm">{title}</p>
          </TooltipContent>
        </Tooltip>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
