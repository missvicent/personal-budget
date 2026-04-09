import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useAllocationsData } from '../../-hooks/allocation/use-allocations-data'
import { AddAllocationDialog } from './add-allocation-dialog'
import { AllocationsGridSkeleton } from './allocations-grid-skeleton'
import { AllocationCard } from './allocation-card'
import { AllocationDeleteDialog } from './allocation-delete-dialog'
import type { BudgetWithProgress } from '@/types/budget.types'
import { cn } from '@/lib/utils'

export const AllocationsGrid = () => {
  const { budgetId } = useParams({ from: '/_app/budget/$budgetId' })
  const {
    allocations,
    isLoading,
    overspendingCategoryIds,
    deleteAllocation,
    isDeleting,
  } = useAllocationsData(budgetId)
  const [deleteTarget, setDeleteTarget] = useState<BudgetWithProgress | null>(
    null,
  )
  const [editTarget, setEditTarget] = useState<BudgetWithProgress | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  if (isLoading) {
    return <AllocationsGridSkeleton />
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteAllocation(
      { id: deleteTarget.allocation_id, budgetId: deleteTarget.budget_id },
      { onSettled: () => setDeleteTarget(null) },
    )
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditTarget(null)
    }
    setAddDialogOpen(open)
  }

  const handleEdit = (item: BudgetWithProgress) => {
    setEditTarget(item)
    setAddDialogOpen(true)
  }

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      <header className="flex items-center justify-end gap-2">
        <AddAllocationDialog
          budgetId={budgetId}
          allocations={allocations}
          onOpenChange={handleDialogOpenChange}
          open={addDialogOpen}
          selectedAllocation={editTarget}
        />
      </header>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        {allocations && allocations.length > 0 ? (
          allocations.map((item) => (
            <AllocationCard
              key={item.allocation_id}
              allocation={item}
              isOverBudget={overspendingCategoryIds.has(item.category_id ?? '')}
              onDelete={() => setDeleteTarget(item)}
              onEdit={() => handleEdit(item)}
            />
          ))
        ) : (
          <div className="col-span-4 flex h-full items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No allocations found
            </p>
          </div>
        )}
      </div>
      <AllocationDeleteDialog
        open={deleteTarget !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
        deleteTarget={deleteTarget}
      />
    </section>
  )
}
