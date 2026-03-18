import { z } from 'zod'

export const budgetSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  amount: z.number().min(1, 'Amount is required'),
  alert_enabled: z.boolean().optional(),
  category_name: z.string().min(1, 'Category name is required'),
  period: z.enum(['monthly', 'yearly']).optional(),
})

export type BudgetFormData = z.infer<typeof budgetSchema>

export function toBudgetItemPayload(data: BudgetFormData) {
  const { category_id, amount, alert_enabled, category_name } = data
  return {
    category_id,
    amount,
    alert_enabled: alert_enabled ?? false,
    name: category_name,
  }
}
