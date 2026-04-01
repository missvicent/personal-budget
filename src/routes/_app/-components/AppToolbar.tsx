import { useMatches } from '@tanstack/react-router'
import type { ToolbarMeta } from '@/routes/__root'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'

export const AppToolbar = () => {
  const matches = useMatches()

  const toolbarMeta = [...matches]
    .reverse()
    .reduce<
      ToolbarMeta | undefined
    >((found, { context }) => found ?? (context as { toolbarMeta?: ToolbarMeta }).toolbarMeta, undefined)

  const title = toolbarMeta?.title
  const description = toolbarMeta?.description
  const balance = toolbarMeta?.balance

  return (
    <header
      className={cn(
        'border-b bg-white',
        'dark:bg-[oklch(0.17_0_0)]/80',
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
            <p className="text-foreground text-lg leading-tight font-semibold capitalize md:text-lg">
              {title}
            </p>
            <span className="text-muted-foreground text-xs leading-tight md:text-sm">
              {description}
            </span>
          </div>
          {balance && (
            <div className="flex flex-col items-end justify-center">
              <p className="text-muted-foreground text-xs leading-tight uppercase md:text-base">
                {balance.label}
              </p>
              <span className="text-foreground text-base leading-tight font-semibold md:text-lg">
                {balance.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
