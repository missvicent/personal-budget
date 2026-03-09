import { Link } from '@tanstack/react-router'
import { SidebarHeader } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export const AppSidebarHeader = () => {
  return (
    <SidebarHeader
      className={cn(
        'h-[72px] border-b',
        'flex-row! items-center gap-2',
        'group-data-[collapsible=icon]:justify-center',
        'group-data-[collapsible=icon]:px-0',
      )}
    >
      <Link
        to="/"
        className="flex cursor-pointer items-center justify-center select-none"
      >
        <div className={cn('group-data-[collapsible=icon]:flex')}>
          <img src="/logo.svg" alt="Personal Budget" className="h-12 w-12" />
        </div>

        <div className="items-left flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-bold">Personal Budget</span>
          <span className="text-muted-foreground text-[10px] font-medium tracking-wide">
            Budget friendly, life ready
          </span>
        </div>
      </Link>
    </SidebarHeader>
  )
}
