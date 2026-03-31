import { useMemo } from 'react'
import { PlusIcon } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { useBudgetDialog } from '../../-hooks/use-budget-dialog'
import { useBudgetItemHandlers } from '../../-hooks/user-budget-item-handlers'
import { BudgetCategoryForm } from './BudgetCategoryForm'
import { BudgetOverviewSkeleton } from './BudgetOverviewSkeleton'
import { BudgetItemCard } from './BudgetItemCard'
import { cn } from '@/lib/utils'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useBudgetItems } from '@/hooks/budget/use-budget-item'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'

export const BudgetOverview = () => {
  const dialog = useBudgetDialog()
  const { budgetId } = useParams({ from: '/_app/budget/$budgetId' })
  const { data: budgetItems, isLoading } = useBudgetItems(budgetId)
  const { data: budgetOverviews } = useBudgetOverview()
  const userBudgetItemHandlers = useBudgetItemHandlers(null, () => {
    dialog.onOpenChange(false)
  })

  const usedCategoryIds = useMemo(
    () => budgetItems?.map((item) => item.category_id) ?? [],
    [budgetItems],
  )

  const remainingBudget = useMemo(() => {
    const overview = budgetOverviews?.find((b) => b.budget_id === budgetId)
    const totalBudget = overview?.budget_amount ?? 0
    const allocatedAmount =
      budgetItems?.reduce((sum, item) => sum + item.amount, 0) ?? 0
    return Math.max(0, totalBudget - allocatedAmount)
  }, [budgetOverviews, budgetId, budgetItems])

  if (isLoading) {
    return <BudgetOverviewSkeleton />
  }

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      <header className="flex flex-col justify-end gap-2 md:flex-row">
        <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" className="p-5">
              <PlusIcon className="h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <BudgetCategoryForm
            budgetId={budgetId}
            isPending={userBudgetItemHandlers.isPending}
            onSubmit={userBudgetItemHandlers.handleSubmit}
            remainingBudget={remainingBudget}
            selectedBudgetItem={null}
            usedCategoryIds={usedCategoryIds}
          />
        </Dialog>
      </header>
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
          {budgetItems && budgetItems.length > 0 ? (
            budgetItems.map((item) => (
              <BudgetItemCard key={item.item_id} budgetItem={item} />
            ))
          ) : (
            <div className="col-span-4 flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">
                No budget items found
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
