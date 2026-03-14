import { useState } from 'react'
import type { Category } from '@/types/database.types'

export const useBudgetDialog = () => {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  return {
    open,
    setOpen,
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) setSelectedCategory(null)
    },
    selectedCategory,
    setSelectedCategory,
  }
}
