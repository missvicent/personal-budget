import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { AddExpenseForm } from './-components'
import { ExpenseList } from './-components/ExpenseList'
import type { ExpenseTransaction } from './-components/ExpenseList'
import type { ExpenseFormData } from '@/lib/validations/expense.schema'
import { groupTransactionsByDate } from '@/lib/transactions.utils'
import {
  useCreateTransaction,
  useDeleteTransaction,
  useGetTransactionsWithCategories,
} from '@/hooks/use-transactions'
import { cn, toSelectOptions } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { SelectField } from '@/components/shared/SelectField'
import { useCategories } from '@/hooks/use-categories'
import { toTransactionPayload } from '@/lib/validations/expense.schema'

export const Route = createFileRoute('/_app/expenses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { mutate: createTransaction } = useCreateTransaction()
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction()
  const { data: categories } = useCategories()
  const { data: transactionsWithCategories } =
    useGetTransactionsWithCategories()
  const [searchValue, setSearchValue] = useState('')
  const categoryOptions = toSelectOptions(
    { label: 'All Categories', value: 'all' },
    categories || [],
    (c) => `${c.icon} ${c.name}`,
    (c) => c.id,
  )

  const groupedExpenses = groupTransactionsByDate(
    transactionsWithCategories ?? [],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') console.log(searchValue)
  }

  const onAddExpense = (data: ExpenseFormData) => {
    createTransaction(toTransactionPayload(data))
  }

  const onEdit = (transaction: ExpenseTransaction) => {
    console.log('Edit transaction:', transaction)
  }

  const onDelete = (id: string) => deleteTransaction(id)

  const onCategoryChange = (value: { label: string; value: string }) => {
    const { value: categoryValue } = value
    if (categoryValue === 'all') return
  }

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:px-8 md:py-8')}>
      <header className="flex flex-col justify-between gap-2 md:flex-row">
        <div className="flex w-full gap-2 md:w-2/3">
          <SearchInput
            placeholder="Search expenses.."
            value={searchValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <SelectField
            items={categoryOptions}
            onChange={onCategoryChange}
            placeholder="All Categories"
            value="all"
          />
        </div>
        <div className="flex justify-start py-2 md:justify-end md:py-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto">
                <PlusIcon className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <AddExpenseForm
              categories={categories ?? []}
              onSubmit={onAddExpense}
            />
          </Dialog>
        </div>
      </header>
      <ExpenseList
        expenses={groupedExpenses}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </section>
  )
}
