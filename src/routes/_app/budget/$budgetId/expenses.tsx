import { createFileRoute } from '@tanstack/react-router'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { PlusIcon } from 'lucide-react'

import { ExpenseTransactionForm } from '@/routes/_app/expenses/-components/ExpenseTransactionForm'
import { ExpenseList } from '@/routes/_app/expenses/-components/ExpenseList'
import { useExpenseActions } from '@/routes/_app/expenses/-hooks/use-expense-actions'
import { useExpenseDialog } from '@/routes/_app/expenses/-hooks/use-expense-dialog'
import { useExpenseFilters } from '@/routes/_app/expenses/-hooks/use-expense-filters'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SearchInput } from '@/components/common/SearchInput'
import { SelectField } from '@/components/shared/SelectField'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { useCategories } from '@/hooks/categories/use-categories'
import { useGetTransactionsWithCategories } from '@/hooks/transactions/use-transaction-with-categories'

export const Route = createFileRoute('/_app/budget/$budgetId/expenses')({
  component: ExpensesPage,
})

function ExpensesPage() {
  const { data: categories } = useCategories()
  const { data: transactionsWithCategories } =
    useGetTransactionsWithCategories()

  const dialog = useExpenseDialog()
  const filters = useExpenseFilters(
    transactionsWithCategories ?? [],
    categories ?? [],
  )
  const actions = useExpenseActions(() => dialog.onOpenChange(false))

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
          <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 p-3 md:w-auto"
                  >
                    <PlusIcon />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Log an Expense</TooltipContent>
            </Tooltip>
            <ExpenseTransactionForm
              key={dialog.selectedTransaction?.id}
              open={dialog.open}
              categories={categories ?? []}
              isPending={actions.isCreating || actions.isUpdating}
              onSubmit={(data) =>
                actions.onSubmit(data, dialog.selectedTransaction)
              }
              selectedTransaction={dialog.selectedTransaction}
            />
          </Dialog>
        </div>
      </header>
      <ExpenseList
        expenses={filters.groupedExpenses}
        onEdit={dialog.onEdit}
        onDelete={actions.onDelete}
        isDeleting={actions.isDeleting}
      />
    </section>
  )
}
