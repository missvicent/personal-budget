import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { NewBudgetFormData } from '@/lib/schemas/budget/new-budget.schema'

export const useNewBudgetActions = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  return {
    handlePeriodChange:
      (form: UseFormReturn<NewBudgetFormData>) => (value: string) => {
        setSelectedPeriod(value)
        form.setValue('period', value as 'monthly' | 'yearly')
      },
    selectedPeriod,
  }
}
