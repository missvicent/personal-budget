import { useMemo, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { CategoryAllocationForm } from './category-allocation-form'
import type { BudgetWithProgress } from '@/types/budget.types'
import { useAllocationHandlers } from '@/routes/_app/budget/-hooks/use-allocation-handlers'
import { useRemainingBudget } from '@/routes/_app/budget/-hooks/use-remaining-budget'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DialogTooltipTrigger } from '@/components/ui/dialog-tooltip-trigger'

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

  const isFullyAllocated = remainingBudget <= 0
  const tooltipContent = isFullyAllocated
    ? 'Budget fully allocated — no remaining funds to assign'
    : 'Add Allocation'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTooltipTrigger dialogOpen={open} tooltipContent={tooltipContent}>
        <Button size="icon" variant="outline" className="h-10 p-3 md:w-auto">
          <PlusIcon />
        </Button>
      </DialogTooltipTrigger>
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
