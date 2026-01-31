import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AddExpenseForm, TotalExpensesCard } from './-components'
import { useSupabase } from '@/hooks/use-supabase'
import { useCategories } from '@/hooks/use-categories'
import { IconCard } from '@/components/shared'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/expenses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const supabase = useSupabase()
  const { data: Categories } = useCategories(supabase)
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)

  const handleClick = (categoryId: string) => {
    console.log(categoryId)
  }

  const onAddExpense = () => {
    setIsAddExpenseModalOpen(true)
  }

  return (
    <div className={cn('flex flex-col gap-4', 'px-4 py-4 md:px-16 md:py-6')}>
      <TotalExpensesCard
        totalExpenses={1000}
        totalExpensesLabel="Total Expenses"
        totalTransactions="10 transactions"
        onAddExpense={onAddExpense}
      />
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          isAddExpenseModalOpen
            ? 'max-h-[500px] opacity-100'
            : 'max-h-0 opacity-0',
        )}
      >
        <AddExpenseForm />
      </div>
      \
    </div>
  )
}

/**
 * <div className={cn(
        'grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-6',
      )}>
        {Categories?.map((category) => (
          <IconCard
            key={category.id}
            title={category.name}
            icon={category.icon}
            onClick={() => handleClick(category.id)}
          />
        ))}
      </div>
 */
