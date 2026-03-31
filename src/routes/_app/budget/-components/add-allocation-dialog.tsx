import { useMemo, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { CategoryAllocationForm } from './category-allocation-form'
import type { BudgetWithProgress } from '@/types/budget.types'
import { useAllocationHandlers } from '@/routes/_app/budget/-hooks/use-allocation-handlers'
import { useRemainingBudget } from '@/routes/_app/budget/-hooks/use-remaining-budget'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AddAllocationDialogProps {
  budgetId: string
  budgetItems: Array<BudgetWithProgress> | undefined
}

export const AddAllocationDialog = ({
  budgetId,
  budgetItems,
}: AddAllocationDialogProps) => {
  const [open, setOpen] = useState(false)
  const remainingBudget = useRemainingBudget(budgetId)
  const allocationHandlers = useAllocationHandlers(null, () => {
    setOpen(false)
  })

  const usedCategoryIds = useMemo(
    () => budgetItems?.map((item) => item.category_id) ?? [],
    [budgetItems],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-5">
          <PlusIcon className="h-4 w-4" />
          Add Budget
        </Button>
      </DialogTrigger>
      <CategoryAllocationForm
        budgetId={budgetId}
        isPending={allocationHandlers.isPending}
        onSubmit={allocationHandlers.handleSubmit}
        remainingBudget={remainingBudget}
        selectedBudgetItem={null}
        usedCategoryIds={usedCategoryIds}
      />
    </Dialog>
  )
}
