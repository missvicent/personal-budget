import { useParams } from '@tanstack/react-router'
import { useCategoryAllocationsData } from '../../-hooks/allocation/use-category-allocations-data'
import { AddAllocationDialog } from './add-allocation-dialog'
import { CategoryAllocationsGridSkeleton } from './category-allocations-grid-skeleton'
import { CategoryAllocationCard } from './category-allocation-card'
import { cn } from '@/lib/utils'

export const CategoryAllocationsGrid = () => {
  const { budgetId } = useParams({ from: '/_app/budget/$budgetId' })
  const { budgetItems, isLoading, overspendingCategoryIds, deleteBudgetItem } =
    useCategoryAllocationsData(budgetId)

  if (isLoading) {
    return <CategoryAllocationsGridSkeleton />
  }

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:p-8')}>
      <header className="flex items-center justify-end gap-2">
        <AddAllocationDialog budgetId={budgetId} budgetItems={budgetItems} />
      </header>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        {budgetItems && budgetItems.length > 0 ? (
          budgetItems.map((item) => (
            <CategoryAllocationCard
              key={item.item_id}
              budgetItem={item}
              isOverBudget={overspendingCategoryIds.has(item.category_id)}
              onDelete={() => deleteBudgetItem(item.item_id)}
              onEdit={() => {}}
            />
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
  )
}
