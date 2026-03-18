import { useState } from 'react'
import type { Budget } from '@/types/database.types'

export const useNewBudgetDialog = () => {
  const [open, setOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<Budget | null>(null)

  return {
    open,
    setOpen,
    selectedPeriod,
    setSelectedPeriod,
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) setSelectedPeriod(null)
    },
  }
}
