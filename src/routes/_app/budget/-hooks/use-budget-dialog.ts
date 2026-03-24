import { useState } from 'react'
import type { Budget, BudgetOverview, Category } from '@/types/database.types'

export const useBudgetDialog = () => {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)

  return {
    open,
    setOpen,
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        setSelectedCategory(null)
        setSelectedBudget(null)
      }
    },
    onEdit: (budget: BudgetOverview, budget_id: string) => {
      setSelectedBudget({
        id: budget_id,
        amount: budget.budget_amount,
        name: budget.budget_name,
        period: budget.period,
        start_date: budget.start_date,
        end_date: budget.end_date,
        is_active: budget.is_active,
      })
      setOpen(true)
    },
    selectedCategory,
    selectedBudget,
    setSelectedCategory,
  }
}
