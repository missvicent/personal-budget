import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

import { ExpenseTransactionForm } from '../-components/expense/expense-transaction-form'
import { ExpenseList } from '../-components/expense/expense-list'
import { useExpenseActions } from '../-hooks/expense/use-expense-actions'
import { useExpenseDialog } from '../-hooks/expense/use-expense-dialog'
import { useExpenseFilters } from '../-hooks/expense/use-expense-filters'
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SearchInput } from '@/components/common/SearchInput'
import { SelectField } from '@/components/shared/SelectField'
import { DialogTooltipTrigger } from '@/components/ui/dialog-tooltip-trigger'

import { useCategories } from '@/hooks/categories/use-categories'
import { useAllocations } from '@/hooks/allocation/use-allocation'
import { useBudgetOverview } from '@/hooks/budget/use-budget-overview'
import { useBudgetCategorySelect } from '@/hooks/budget/use-budget-category-select'
import { useGetTransactionsWithCategories } from '@/hooks/transactions/use-transaction-with-categories'
import { getOverspendingTransactionIds } from '@/lib/budget.utils'

export const Route = createFileRoute('/_app/budget/$budgetId/expenses')({
  component: ExpensesPage,
})

function ExpensesPage() {
  const { budgetId } = Route.useParams()
  const { data: categories } = useCategories()
  const { data: transactionsWithCategories } =
    useGetTransactionsWithCategories(budgetId)
  const { data: allocations } = useAllocations(budgetId)
  const { data: budgetOverviews } = useBudgetOverview()
  const budgetAmount =
    budgetOverviews?.find((b) => b.budget_id === budgetId)?.budget_amount ?? 0

  const { transactionIds: overspendingIds } = useMemo(
    () =>
      getOverspendingTransactionIds(
        transactionsWithCategories ?? [],
        budgetAmount,
      ),
    [transactionsWithCategories, budgetAmount],
  )

  const { groups, ensureAllocation } = useBudgetCategorySelect(
    budgetId,
    categories ?? [],
    allocations ?? [],
  )

  const dialog = useExpenseDialog()
  const filters = useExpenseFilters(
    transactionsWithCategories ?? [],
    categories ?? [],
  )
  const fallbackCategoryId = useMemo(
    () =>
      categories?.find(
        (c) => c.name === 'Other Expense' && c.category_type === 'expense',
      )?.id,
    [categories],
  )

  const actions = useExpenseActions(
    () => dialog.onOpenChange(false),
    budgetId,
    ensureAllocation,
    fallbackCategoryId,
  )

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:px-8 md:py-8')}>
      <header className="flex flex-col gap-2 md:flex-row lg:justify-between">
        <div className="order-2 flex w-full gap-2 md:order-first lg:w-1/3">
          <SearchInput
            placeholder="Search expenses.."
            value={filters.searchValue}
            onChange={filters.onChange}
            onKeyDown={filters.onKeyDown}
          />
          <SelectField
            items={filters.categoryOptions}
            onChange={filters.onCategoryChange}
            placeholder="All Categories"
            value={filters.selectedCategory}
          />
        </div>
        <div className="order-1 flex justify-end lg:order-last">
          <ResponsiveDialog
            open={dialog.open}
            onOpenChange={dialog.onOpenChange}
          >
            <DialogTooltipTrigger
              dialogOpen={dialog.open}
              tooltipContent="Log an Expense"
            >
              <Button
                size="icon"
                variant="default"
                className="h-10 p-3 md:w-auto"
              >
                <PlusIcon />
              </Button>
            </DialogTooltipTrigger>
            <ExpenseTransactionForm
              key={dialog.selectedTransaction?.id}
              open={dialog.open}
              groups={groups}
              isPending={actions.isCreating || actions.isUpdating}
              onSubmit={(data) =>
                actions.onSubmit(data, dialog.selectedTransaction)
              }
              selectedTransaction={dialog.selectedTransaction}
            />
          </ResponsiveDialog>
        </div>
      </header>
      <ExpenseList
        expenses={filters.groupedExpenses}
        onEdit={dialog.onEdit}
        onDelete={actions.onDelete}
        isDeleting={actions.isDeleting}
        overspendingIds={overspendingIds}
      />
    </section>
  )
}
