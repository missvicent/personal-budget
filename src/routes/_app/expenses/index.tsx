import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { AddExpenseForm } from './-components'
import { ExpenseList } from './-components/ExpenseList'
import { mockExpenses } from './-components/mock'
import { cn, toSelectOptions } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/SearchInput'
import { SelectField } from '@/components/shared/SelectField'
import { useCategories } from '@/hooks/use-categories'
import { useSupabase } from '@/hooks/use-supabase'

export const Route = createFileRoute('/_app/expenses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const expenses = mockExpenses
  const supabase = useSupabase()
  const { data: categories } = useCategories(supabase)
  const [searchValue, setSearchValue] = useState('')
  const categoryOptions = toSelectOptions(
    { label: 'All Categories', value: 'all' },
    categories || [],
    (c) => `${c.icon} ${c.name}`,
    (c) => c.id,
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log(searchValue)
    }
  }

  const onAddExpense = () => {
    console.log('add expense')
  }

  const onCategoryChange = (value: { label: string; value: string }) => {
    const { value: categoryValue, label: categoryLabel } = value
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
          />
        </div>
        <div className="flex justify-start py-2 md:justify-end md:py-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                onClick={onAddExpense}
                className="w-full md:w-auto"
              >
                <PlusIcon className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <AddExpenseForm
              categories={categories || []}
              onSubmit={onAddExpense}
            />
          </Dialog>
        </div>
      </header>
      <ExpenseList expenses={expenses} />
    </section>
  )
}
