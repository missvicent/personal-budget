import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { BudgetItemFormData } from '@/lib/schemas/budget/budget-item.schema'

export const usePeriodSelector = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  return {
    selectedPeriod,
    handlePeriodChange:
      (form: UseFormReturn<BudgetItemFormData>) => (value: string) => {
        setSelectedPeriod(value)
        form.setValue('period', value as 'monthly' | 'yearly')
      },
  }
}
