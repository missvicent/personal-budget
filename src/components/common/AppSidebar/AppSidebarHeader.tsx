import { SidebarHeader } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export default function AppSidebarHeader() {
  return (
    <SidebarHeader
      className={cn(
        'h-[72px] border-b-2',
        'flex-row! items-center gap-2',
        'group-data-[collapsible=icon]:justify-center',
        'group-data-[collapsible=icon]:px-0',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2',
          'group-data-[collapsible=icon]:hidden',
        )}
      >
        <img src="/logo.svg" alt="BudgetApp" className="h-12 w-12" />
      </div>
    </SidebarHeader>
  )
}
