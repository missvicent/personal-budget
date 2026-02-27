import { createFileRoute } from '@tanstack/react-router'
import type { BudgetSummaryCardItem } from '@/routes/_app/budget/-components/BudgetSummaryCard'

import { BudgetSummaryCard } from '@/routes/_app/budget/-components/BudgetSummaryCard'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/budget/')({
  component: RouteComponent,
})

function RouteComponent() {
  const data: Array<BudgetSummaryCardItem> = [
    { id: '1', title: 'Budget', value: 1000 },
    { id: '2', title: 'Remaining', value: 500 },
  ]

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:px-8 md:py-8')}>
      <header className="flex flex-col gap-2 md:flex-row lg:justify-end">
        <BudgetSummaryCard data={data} />
      </header>
    </section>
  )
}
