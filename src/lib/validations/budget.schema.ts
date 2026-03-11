import { z } from 'zod'

export const budgetSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  amount: z.number().min(1, 'Amount is required'),
  alert_enabled: z.boolean().optional(),
  period: z.enum(['weekly', 'monthly', 'yearly']).optional(),
})

export type BudgetFormData = z.infer<typeof budgetSchema>

export function toBudgetPayload(data: BudgetFormData) {
  const { category_id, amount, alert_enabled, period } = data
  return {
    category_id,
    amount,
    alert_enabled: alert_enabled ?? false,
    period: period ?? 'monthly',
  }
}
