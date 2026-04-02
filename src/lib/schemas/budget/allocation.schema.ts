import { z } from 'zod'

export const allocationSchema = z.object({
  alert_enabled: z.boolean().optional(),
  amount: z.number().min(1, 'Amount is required'),
  budget_id: z.string().min(1, 'Budget is required'),
  category_id: z.string().min(1, 'Category is required'),
  id: z.string().optional(),
})

export const createAllocationSchema = (remainingBudget: number) =>
  allocationSchema.extend({
    amount: z
      .number()
      .min(1, 'Amount is required')
      .max(
        remainingBudget,
        `Amount cannot exceed the remaining budget ($${remainingBudget.toFixed(2)})`,
      ),
  })

export const updateAllocationSchema = (
  remainingBudget: number,
  currentAmount: number,
) =>
  allocationSchema.extend({
    amount: z
      .number()
      .min(1, 'Amount is required')
      .max(
        remainingBudget + currentAmount,
        `Amount cannot exceed the remaining budget ($${(remainingBudget + currentAmount).toFixed(2)})`,
      ),
  })

export type AllocationFormData = z.infer<typeof allocationSchema>

export function toAllocationPayload(data: AllocationFormData) {
  const { amount, category_id, alert_enabled, budget_id, id } = data
  return {
    amount,
    budget_id,
    category_id,
    id: id ?? undefined,
    alert_enabled: alert_enabled ?? false,
  }
}
