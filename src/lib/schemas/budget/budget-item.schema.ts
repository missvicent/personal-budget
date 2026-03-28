import { z } from 'zod'

export const budgetItemSchema = z.object({
  alert_enabled: z.boolean().optional(),
  amount: z.number().min(1, 'Amount is required'),
  budget_id: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  category_name: z.string().min(1, 'Category name is required'),
  id: z.string().optional(),
})

export const createBudgetItemSchema = (remainingBudget: number) =>
  budgetItemSchema.refine((data) => data.amount <= remainingBudget, {
    message: `Amount cannot exceed the remaining budget ($${remainingBudget.toFixed(2)})`,
    path: ['amount'],
  })

export type BudgetItemFormData = z.infer<typeof budgetItemSchema>

export function toBudgetItemPayload(data: BudgetItemFormData) {
  const { category_id, category_name, amount, alert_enabled, budget_id, id } =
    data
  return {
    alert_enabled: alert_enabled ?? false,
    amount,
    budget_id,
    category_id,
    id: id ?? undefined,
    name: category_name,
  }
}
