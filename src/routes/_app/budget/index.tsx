import { createFileRoute } from '@tanstack/react-router'
import { useNewBudgetDialog } from './-hooks/use-new-budget'
import { BudgetItem } from './-components/BudgetItem'
import { NewBudgetDialog } from './-components/NewBudget'
import { CreateCard } from '@/components/shared/CreateCard'
import { Dialog } from '@/components/ui/dialog'

export const Route = createFileRoute('/_app/budget/')({
  component: RouteComponent,
})

function RouteComponent() {
  const dialog = useNewBudgetDialog()

  const handleCreateBudget = () => {
    dialog.setOpen(true)
  }

  return (
    <section className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-2 md:p-8 2xl:grid-cols-4">
      <BudgetItem />
      <CreateCard onClick={handleCreateBudget}>
        <p className="text-muted-foreground/50 group-hover:text-primary/50 text-sm leading-tight font-medium">
          New Budget
        </p>
        <p className="text-muted-foreground/30 text-xs leading-tight">
          Add a new monthly or yearly period
        </p>
      </CreateCard>
      <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
        <NewBudgetDialog onSubmit={handleCreateBudget} />
      </Dialog>
    </section>
  )
}
