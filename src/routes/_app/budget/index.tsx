import { createFileRoute } from '@tanstack/react-router'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { useBudgetDialog } from './-hooks/use-budget-dialog'
import { BudgetCategoryForm } from './-components/BudgetCategoryForm'
import type { BudgetSummaryCardItem } from '@/routes/_app/budget/-components/BudgetSummaryCard'
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

  const onAddCategory = () => {
    console.log('add category')
    dialog.onOpenChange(true)
  }

  const dialog = useBudgetDialog()

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      <header className="flex flex-col items-center gap-2 md:flex-row lg:justify-end">
        <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
          <DialogTrigger asChild>
            <BudgetSummaryCard data={data} onAddCategory={onAddCategory} />
          </DialogTrigger>
          <BudgetCategoryForm
            open={dialog.open}
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
