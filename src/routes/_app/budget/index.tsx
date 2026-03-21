import { createFileRoute } from '@tanstack/react-router'

import { BudgetForm } from './-components/BudgetForm'
import { useBudgetActions } from './-hooks/use-budget-actions'
import { useBudgetDialog } from './-hooks/use-budget'

import { BudgetItem } from './-components/BudgetItem'
import { CreateCard } from '@/components/shared/CreateCard'
import { Dialog } from '@/components/ui/dialog'

export const Route = createFileRoute('/_app/budget/')({
  component: RouteComponent,
})

function RouteComponent() {
  const dialog = useBudgetDialog()
  const actions = useBudgetActions(() => dialog.onOpenChange(false))
  const budgets = actions.getBudgets()

  return (
    <section className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-2 md:p-8 2xl:grid-cols-4">
      {budgets.length > 0 &&
        budgets.map((budget) => (
          <BudgetItem key={budget.budget_id} budget={budget} />
        ))}
      <CreateCard onClick={() => dialog.setOpen(true)}>
        <p className="text-muted-foreground/50 group-hover:text-primary/50 text-sm leading-tight font-medium">
          New Budget
        </p>
        <p className="text-muted-foreground/30 text-xs leading-tight">
          Add a new monthly or yearly period
        </p>
      </CreateCard>
      <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
        <BudgetForm
          open={dialog.open}
          onSubmit={(data) => actions.onSubmit(data, dialog.selectedPeriod)}
          isPending={actions.isCreating || actions.isUpdating}
        />
      </Dialog>
    </section>
  )
}
