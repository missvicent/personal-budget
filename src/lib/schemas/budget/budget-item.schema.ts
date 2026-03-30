import { z } from 'zod'

export const budgetItemSchema = z.object({
  alert_enabled: z.boolean().optional(),
  amount: z.number().min(1, 'Amount is required'),
  budget_id: z.string().min(1, 'Budget is required'),
  category_id: z.string().min(1, 'Category is required'),
  id: z.string().optional(),
})

export const createBudgetItemSchema = (remainingBudget: number) =>
  budgetItemSchema.extend({
    amount: z
      .number()
      .min(1, 'Amount is required')
      .max(
        remainingBudget,
        `Amount cannot exceed the remaining budget ($${remainingBudget.toFixed(2)})`,
      ),
  })

export type BudgetItemFormData = z.infer<typeof budgetItemSchema>

export function toBudgetItemPayload(data: BudgetItemFormData) {
  const { amount, category_id, alert_enabled, budget_id, id } = data
  return {
    amount,
    budget_id,
    category_id,
    id: id ?? undefined,
    alert_enabled: alert_enabled ?? false,
  }
}
