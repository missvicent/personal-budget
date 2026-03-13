import { useState } from 'react'
import type { Debt } from '@/types/database.types'

export type DebtDialogMode = 'debt' | 'payment'

export function useDebtDialog() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<DebtDialogMode>('debt')
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)

  return {
    open,
    mode,
    selectedDebt,
    openDebtForm: (debt?: Debt) => {
      setMode('debt')
      setSelectedDebt(debt ?? null)
      setOpen(true)
    },
    openPaymentForm: (debt: Debt) => {
      setMode('payment')
      setSelectedDebt(debt)
      setOpen(true)
    },
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        setSelectedDebt(null)
      }
    },
  }
}
