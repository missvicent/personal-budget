import { SidebarHeader, SidebarTrigger } from '../../ui/sidebar'
import { cn } from '@/lib/utils'

export default function AppSidebarHeader() {
  return (
    <SidebarHeader
      className={cn(
        'border-sidebar-border h-[72px]',
        'flex-row! items-center gap-2',
        'border-b-2 px-6 group-data-[collapsible=icon]:justify-center',
        'group-data-[collapsible=icon]:px-0',
      )}
    >
      <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
        <img src="/logo.svg" alt="BudgetApp" className="h-6 w-6" />
        <p className="text-md leading-tight font-semibold">Personal Budget</p>
      </div>
      <SidebarTrigger />
    </SidebarHeader>
  )
}
