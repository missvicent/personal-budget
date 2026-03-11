import { useState } from 'react'

export const useBudgetDialog = () => {
  const [open, setOpen] = useState(false)
  return {
    open,
    setOpen,
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen)
    },
  }
}
