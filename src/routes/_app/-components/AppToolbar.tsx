import { useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NAVIGATION_ITEMS } from '@/config/navigation'

export const AppToolbar = () => {
  const { pathname } = useLocation()
  const itemData = NAVIGATION_ITEMS.find((item) => item.url === pathname)
  const { description } = itemData ?? { description: '' }

  return (
    <header
      className={cn(
        'bg-sidebar border-b',
        'h-[72px]',
        'flex shrink-0 items-center',
        'select-none',
      )}
    >
      <div
        className={cn('flex w-full items-center justify-start', 'gap-2 p-4')}
      >
        <SidebarTrigger className="md:hidden" />
        <div className="flex w-full items-center justify-between gap-2 px-4">
          <div className="flex flex-col items-start justify-center">
            <p className="text-foreground text-lg leading-tight font-semibold capitalize md:text-2xl">
              {pathname.split('/').pop()}
            </p>
            <span className="text-muted-foreground text-xs leading-tight md:text-base">
              {description}
            </span>
          </div>
          <div className="flex flex-col items-end justify-center">
            <p className="text-muted-foreground text-xs leading-tight uppercase md:text-base">
              Balance
            </p>
            <span className="text-foreground text-xl leading-tight font-semibold md:text-2xl">
              $4418.26
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
