import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export const BudgetOverviewSkeleton = () => {
  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      {/* Summary card row */}
      <header className="flex flex-col items-center gap-2 md:flex-row lg:justify-end">
        <div className="flex items-center justify-center gap-0">
          <Skeleton className="h-[84px] w-36 rounded-l-xl rounded-r-none" />
          <Skeleton className="h-[84px] w-36 rounded-none border-l border-l-transparent" />
          <Skeleton className="h-[84px] w-14 rounded-l-none rounded-r-xl border-l border-l-transparent" />
        </div>
      </header>

      {/* Category list */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </section>
  )
}
