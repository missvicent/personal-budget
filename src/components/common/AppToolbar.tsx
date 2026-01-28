import { SidebarTrigger } from '../ui/sidebar'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'

export default function AppToolbar() {
  return (
    <header
      className={cn(
        'bg-sidebar border-b-2',
        'h-[72px]',
        'flex shrink-0 items-center',
      )}
    >
      <div className={cn('flex w-full items-center justify-end', 'gap-2 p-4')}>
        <SidebarTrigger className="md:hidden" />
      </div>
    </header>
  )
}
