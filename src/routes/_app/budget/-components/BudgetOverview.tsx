import { useBudgetDialog } from '../-hooks/use-budget-dialog'
import { BudgetCategoryForm } from './BudgetCategoryForm'
import { BudgetSummaryCard } from './BudgetSummaryCard'
import type { BudgetSummaryCardItem } from './BudgetSummaryCard'
import { cn } from '@/lib/utils'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

export const BudgetOverview = () => {
  const dialog = useBudgetDialog()

  const data: Array<BudgetSummaryCardItem> = [
    { id: '1', title: 'Budget', value: 1000 },
    { id: '2', title: 'Remaining', value: 0 },
  ]

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      <header className="flex flex-col items-center gap-2 md:flex-row lg:justify-end">
        <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
          <DialogTrigger asChild>
            <BudgetSummaryCard data={data} />
          </DialogTrigger>
          <BudgetCategoryForm
            categories={[]}
            isPending={false}
            onSubmit={() => {}}
            selectedCategory={null}
          />
        </Dialog>
      </header>
    </section>
  )
}
