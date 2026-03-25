import { z } from 'zod'
import type { Budget } from '@/types/database.types'
import { calculatePeriod } from '@/lib/dates/calculatePeriod'

export const BudgetItemSchema = z.object({
  amount: z.number().min(1, 'Amount is required'),
  period: z.enum(['monthly', 'yearly']).optional(),
  start_date: z.string().min(1, 'You must choose a date'),
  name: z.string().min(1, 'You must choose a name'),
  is_active: z.boolean().optional(),
  id: z.string().optional(),
})

export type BudgetItemFormData = z.infer<typeof BudgetItemSchema>

export function toBudgetItemRequestBody(data: BudgetItemFormData): Budget {
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
