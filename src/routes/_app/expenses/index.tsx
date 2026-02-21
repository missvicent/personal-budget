import { createFileRoute } from '@tanstack/react-router'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ExpenseTransactionForm } from './-components/ExpenseTransactionForm'
import { ExpenseList } from './-components/ExpenseList'
import type { ExpenseFormData } from '@/lib/validations/expense.schema'
import type { ExpenseTransaction } from './-components/ExpenseList'

import { Button } from '@/components/ui/button'
import { cn, toSelectOptions } from '@/lib/utils'
import { groupTransactionsByDate } from '@/lib/transactions.utils'
import { SearchInput } from '@/components/common/SearchInput'
import { SelectField } from '@/components/shared/SelectField'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { toTransactionPayload } from '@/lib/validations/expense.schema'
import { useCategories } from '@/hooks/categories/use-categories'
import { useCreateTransaction } from '@/hooks/transactions/use-create-transaction'
import { useDeleteTransaction } from '@/hooks/transactions/use-delete-transaction'
import { useGetTransactionsWithCategories } from '@/hooks/transactions/use-transaction-with-categories'
import { useUpdateTransaction } from '@/hooks/transactions/use-update-transaction'

export const Route = createFileRoute('/_app/expenses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTransaction, setSelectedTransaction] =
    useState<ExpenseTransaction | null>(null)

  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction()
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction()
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction()
  const { data: categories } = useCategories()
  const { data: transactionsWithCategories } =
    useGetTransactionsWithCategories()
  const categoryOptions = useMemo(
    () =>
      toSelectOptions(
        { label: 'All Categories', value: 'all' },
        categories || [],
        (c) => `${c.icon} ${c.name}`,
        (c) => c.id,
      ),
    [categories],
  )

  const filteredTransactions = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return (transactionsWithCategories ?? []).filter((tx) => {
      if (selectedCategory !== 'all' && tx.category_id !== selectedCategory)
        return false
      if (query && !tx.description.toLowerCase().includes(query)) return false
      return true
    })
  }, [transactionsWithCategories, searchValue, selectedCategory])

  const groupedExpenses = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setSearchValue((e.target as HTMLInputElement).value)
  }

  const onSubmit = (data: ExpenseFormData) => {
    if (selectedTransaction) {
      updateTransaction(
        { ...toTransactionPayload(data), id: selectedTransaction.id },
        {
          onSuccess: () => setOpen(false),
        },
      )
    } else {
      createTransaction(toTransactionPayload(data), {
        onSuccess: () => setOpen(false),
      })
    }
  }

  const onEdit = (transaction: ExpenseTransaction) => {
    console.log('transaction', transaction)
    setOpen(true)
    setSelectedTransaction(transaction)
  }

  const onDelete = (id: string, onSuccess: () => void) =>
    deleteTransaction(id, { onSuccess })

  const onCategoryChange = (value: { label: string; value: string }) => {
    setSelectedCategory(value.value)
  }

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) setSelectedTransaction(null)
  }

  return (
    <section className={cn('flex flex-col gap-4', 'px-4 py-4 md:px-8 md:py-8')}>
      <header className="flex flex-col gap-2 md:flex-row lg:justify-between">
        <div className="order-2 flex w-full gap-2 md:order-first lg:w-1/3">
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
            value={selectedCategory}
          />
        </div>
        <div className="order-1 flex justify-end lg:order-last">
          <Dialog open={open} onOpenChange={onOpenChange}>
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
              <TooltipContent>
                <p>Add Expense</p>
              </TooltipContent>
            </Tooltip>
            <ExpenseTransactionForm
              categories={categories ?? []}
              isPending={isCreating || isUpdating}
              onSubmit={onSubmit}
              selectedTransaction={selectedTransaction}
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
