import { z } from 'zod'
import type { Budget } from '@/types/database.types'
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

export function toBudgetRequestBody(data: BudgetFormData): Budget {
  const { amount, period, start_date, name, is_active, id } = data
  return {
    id: id ?? undefined,
    amount,
    name,
    period,
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
): Budget {
  const { amount, period, start_date, name, is_active, id } = data
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
