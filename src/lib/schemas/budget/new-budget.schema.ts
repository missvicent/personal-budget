import { z } from 'zod'
import { calculatePeriod } from '@/lib/dates/calculatePeriod'

export const newBudgetSchema = z.object({
  period: z.enum(['monthly', 'yearly']).optional(),
  start_date: z.string().min(1, 'You must choose a date'),
})

export type NewBudgetFormData = z.infer<typeof newBudgetSchema>

export function toNewBudgetPayload(data: NewBudgetFormData) {
  const { period, start_date } = data
  return {
    period,
    start_date,
    end_date: calculatePeriod(
      new Date(start_date),
      period ?? 'monthly',
    ).toISOString(),
  }
}
