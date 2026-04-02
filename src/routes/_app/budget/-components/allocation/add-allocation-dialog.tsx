import { useMemo, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { AllocationForm } from './allocation-form'
import type { BudgetWithProgress } from '@/types/budget.types'
import { useAllocationHandlers } from '@/routes/_app/budget/-hooks/allocation/use-allocation-handlers'
import { useRemainingBudget } from '@/routes/_app/budget/-hooks/allocation/use-remaining-budget'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import { DialogTooltipTrigger } from '@/components/ui/dialog-tooltip-trigger'

interface AddAllocationDialogProps {
  budgetId: string
  allocations: Array<BudgetWithProgress> | undefined
}

export const AddAllocationDialog = ({
  budgetId,
  allocations,
}: AddAllocationDialogProps) => {
  const [open, setOpen] = useState(false)
  const remainingBudget = useRemainingBudget(budgetId)
  const allocationHandlers = useAllocationHandlers(null, () => {
    setOpen(false)
  })

  const usedCategoryIds = useMemo(
    () => allocations?.map((item) => item.category_id) ?? [],
    [allocations],
  )

  const isFullyAllocated = remainingBudget <= 0
  const tooltipContent = isFullyAllocated
    ? 'Budget fully allocated — no remaining funds to assign'
    : 'Add Allocation'

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <DialogTooltipTrigger dialogOpen={open} tooltipContent={tooltipContent}>
        <Button size="icon" variant="default" className="h-10 p-3 md:w-auto">
          <PlusIcon />
        </Button>
      </DialogTooltipTrigger>
      <AllocationForm
        budgetId={budgetId}
        isPending={allocationHandlers.isPending}
        onSubmit={allocationHandlers.handleSubmit}
        remainingBudget={remainingBudget}
        selectedAllocation={null}
        usedCategoryIds={usedCategoryIds}
      />
    </ResponsiveDialog>
  )
}
