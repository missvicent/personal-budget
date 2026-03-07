import { createFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import type { BudgetSummaryCardItem } from '@/routes/_app/budget/-components/BudgetSummaryCard'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { BudgetSummaryCard } from '@/routes/_app/budget/-components/BudgetSummaryCard'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/budget/')({
  component: RouteComponent,
})

function RouteComponent() {
  const data: Array<BudgetSummaryCardItem> = [
    { id: '1', title: 'Budget', value: 1000 },
    { id: '2', title: 'Remaining', value: 0 },
  ]

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      <header className="flex flex-col items-center gap-2 md:flex-row lg:justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="p-4">
              <PlusIcon className="h-4 w-4" />
              Add Category
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Category</p>
          </TooltipContent>
        </Tooltip>
        <BudgetSummaryCard data={data} />
      </header>
    </section>
  )
}
