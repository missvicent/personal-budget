import { z } from 'zod'

const baseAllocationSchema = z.object({
  alert_enabled: z.boolean().optional(),
  amount: z.number().min(1, 'Amount is required'),
  budget_id: z.string().min(1, 'Budget is required'),
  id: z.string().optional(),
  mode: z.enum(['expense', 'savings']),
  category_id: z.string().optional(),
  goal_id: z.string().optional(),
})

export const allocationSchema = baseAllocationSchema.superRefine(
  (data, ctx) => {
    if (data.mode === 'expense' && !data.category_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category is required',
        path: ['category_id'],
      })
    }
    if (data.mode === 'savings' && !data.goal_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Goal is required',
        path: ['goal_id'],
      })
    }
  },
)

export const createAllocationSchema = (remainingBudget: number) =>
  baseAllocationSchema
    .extend({
      amount: z
        .number()
        .min(1, 'Amount is required')
        .max(
          remainingBudget,
          `Amount cannot exceed the remaining budget ($${remainingBudget.toFixed(2)})`,
        ),
    })
    .superRefine((data, ctx) => {
      if (data.mode === 'expense' && !data.category_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Category is required',
          path: ['category_id'],
        })
      }
      if (data.mode === 'savings' && !data.goal_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Goal is required',
          path: ['goal_id'],
        })
      }
    })

export const updateAllocationSchema = (
  remainingBudget: number,
  currentAmount: number,
) =>
  baseAllocationSchema
    .extend({
      amount: z
        .number()
        .min(1, 'Amount is required')
        .max(
          remainingBudget + currentAmount,
          `Amount cannot exceed the remaining budget ($${(remainingBudget + currentAmount).toFixed(2)})`,
        ),
    })
    .superRefine((data, ctx) => {
      if (data.mode === 'expense' && !data.category_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Category is required',
          path: ['category_id'],
        })
      }
      if (data.mode === 'savings' && !data.goal_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Goal is required',
          path: ['goal_id'],
        })
      }
    })

export type AllocationFormData = z.infer<typeof baseAllocationSchema>

export function toAllocationPayload(data: AllocationFormData) {
  const { amount, alert_enabled, budget_id, id, mode, category_id, goal_id } =
    data
  return {
    amount,
    budget_id,
    id: id ?? undefined,
    alert_enabled: alert_enabled ?? false,
    category_id: mode === 'expense' ? category_id : null,
    goal_id: mode === 'savings' ? goal_id : null,
  }
}
