import { useState } from 'react'
import type { Budget, BudgetOverview, Category } from '@/types/database.types'
import { toBudget } from '@/lib/mappers/budget'

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
    onEdit: (budget: BudgetOverview) => {
      setSelectedBudget(toBudget(budget))
      setOpen(true)
    },
    selectedCategory,
    selectedBudget,
    setSelectedCategory,
  }
}
