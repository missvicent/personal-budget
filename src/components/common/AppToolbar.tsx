import { useLocation } from '@tanstack/react-router'
import { SidebarTrigger } from '../ui/sidebar'
import { cn } from '@/lib/utils'

export default function AppToolbar() {
  const { pathname } = useLocation()
  return (
    <header
      className={cn(
        'bg-sidebar border-b',
        'h-[72px]',
        'flex shrink-0 items-center',
        'pointer-events-none select-none',
      )}
    >
      <div
        className={cn('flex w-full items-center justify-start', 'gap-2 p-4')}
      >
        <SidebarTrigger className="md:hidden" />
        <div className="flex w-full items-center justify-between gap-2">
          <p className="text-foreground/80 text-xl font-medium capitalize">
            {pathname.split('/').pop()}
          </p>
          <p className="text-muted-foreground text-sm">Balance</p>
        </div>
      </div>
    </header>
  )
}
