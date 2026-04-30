import { z } from 'zod'
import type { CreateBudget, UpdateBudget } from '@/types/database.types'
import { calculatePeriod } from '@/lib/dates/calculatePeriod'

export const budgetSchema = z.object({
  amount: z.number().min(1, 'Amount is required'),
  period: z.enum(['monthly', 'yearly']).optional(),
  start_date: z.string().min(1, 'You must choose a date'),
  name: z.string().min(1, 'You must choose a name'),
  is_active: z.boolean().optional(),
  id: z.string().optional(),
})

export type BudgetFormData = z.infer<typeof budgetSchema>

export const budgetFormDefaults: BudgetFormData = {
  name: '',
  amount: 0,
  period: 'monthly',
  start_date: '',
}

export function toBudgetRequestBody(data: BudgetFormData): CreateBudget {
  const { amount, period, start_date, name, is_active } = data
  return {
    amount,
    name,
    period: period ?? 'monthly',
    start_date,
    end_date: calculatePeriod(
      new Date(start_date),
      period ?? 'monthly',
    ).toISOString(),
    is_active: is_active ?? true,
  }
}

export function toUpdateRequestBody(
  data: BudgetFormData,
  dirtyFields: Partial<Record<keyof BudgetFormData, boolean>>,
): UpdateBudget & { id: string } {
  const { amount, period, start_date, name, is_active, id } = data
  if (!id) {
    throw new Error('toUpdateRequestBody requires an id on the form data')
  }
  const shouldRecalculateEndDate = dirtyFields.start_date || dirtyFields.period

  return {
    id,
    amount,
    name,
    period,
    start_date,
    end_date: shouldRecalculateEndDate
      ? calculatePeriod(new Date(start_date), period ?? 'monthly').toISOString()
      : undefined,
    is_active: is_active ?? true,
  }
}
