import { createFileRoute } from '@tanstack/react-router'

import { BudgetForm } from './-components/budget-list/BudgetForm'
import { useBudgetHandlers } from './-hooks/use-budget-handlers'
import { useBudgetDialog } from './-hooks/use-budget-dialog'

import { BudgetItem } from './-components/budget-list/BudgetItem'
import { staticToolbarMeta } from '@/lib/toolbar'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { CreateCard } from '@/components/shared/CreateCard'
import { Dialog } from '@/components/ui/dialog'

export const Route = createFileRoute('/_app/budget/')({
  beforeLoad: staticToolbarMeta({
    title: 'Budgets',
    description: 'Set and monitor budget limits',
    balance: { label: 'Balance', value: '$0.00' },
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const dialog = useBudgetDialog()
  const { data: budgets } = useBudgetOverview()
  const { handleSubmit, handleDelete, isPending } = useBudgetHandlers(
    dialog.selectedBudget,
    () => dialog.onOpenChange(false),
  )
  const budgetList = budgets ?? []

  return (
    <section className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-2 md:p-8 2xl:grid-cols-4">
      {budgetList.length > 0 &&
        budgetList.map((budget) => (
          <BudgetItem
            key={budget.budget_id}
            budget={budget}
            onEdit={() => dialog.onEdit(budget)}
            onDelete={handleDelete}
          />
        ))}
      <CreateCard onClick={() => dialog.setOpen(true)}>
        <p className="text-muted-foreground group-hover:text-primary/50 text-sm leading-tight font-medium">
          New Budget
        </p>
        <p className="text-muted-foreground/70 text-xs leading-tight">
          Add a new monthly or yearly period
        </p>
      </CreateCard>
      <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
        <BudgetForm
          open={dialog.open}
          selectedBudget={dialog.selectedBudget}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </Dialog>
    </section>
  )
}
